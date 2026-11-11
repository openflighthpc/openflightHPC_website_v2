#!/usr/bin/env bash
#
# png-to-webp.sh — Convert every PNG under public/ to WebP and update the
# references to them in markdown, then delete the original PNGs.
#
# Repeatable/idempotent: on a tree that is already converted it does nothing.
# Every converted image is validated before its PNG is deleted.
#
# Usage:
#   ./scripts/png-to-webp.sh [--dry-run] [--quality N] [--root DIR]
#
#   --dry-run     Report what would happen without touching anything.
#   --quality N   WebP lossy quality, 0-100 (default: 85).
#                 Files that come out larger than their PNG lossy are retried
#                 losslessly rather than kept as the bigger lossy result.
#   --root DIR    Operate on DIR instead of this repo's root.
#   PNG_TO_WEBP_QUALITY=85 ./scripts/png-to-webp.sh   (equivalent to --quality)

set -euo pipefail

DRY_RUN=0
ROOT_ARG=""
QUALITY="${PNG_TO_WEBP_QUALITY:-85}"

usage() { grep '^#' "$0" | cut -c3- | head -n 20; exit 0; }

while [ $# -gt 0 ]; do
   case "$1" in
      --dry-run) DRY_RUN=1 ;;
      --quality) QUALITY="$2"; shift ;;
      --root) ROOT_ARG="$2"; shift ;;
      -h|--help) usage ;;
      *) echo "Unknown option: $1" >&2; usage ;;
   esac
   shift
done

if ! command -v magick >/dev/null 2>&1 && ! command -v convert >/dev/null 2>&1; then
   echo "Error: neither 'magick' nor 'convert' (ImageMagick) is installed." >&2
   exit 1
fi
IM="magick"
command -v magick >/dev/null 2>&1 || IM="convert"

# Resolve the working root: --root flag > git toplevel > script's parent dir.
ROOT="$ROOT_ARG"
if [ -z "$ROOT" ]; then
   ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
fi
if [ -z "$ROOT" ]; then
   ROOT="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
fi
cd "$ROOT"

if [ ! -d public ]; then
   echo "Error: no public/ directory found under $ROOT" >&2
   exit 1
fi

# --- helpers ---------------------------------------------------------------

filesize() { stat -c%s "$1"; }

# Convert one png to webp; lossless retry when the lossy result is bigger.
convert_one() {
   local png="$1" webp="${png%.*}.webp"
   "$IM" "$png" -quality "$QUALITY" -define webp:method=6 "$webp" || return 1

   if [ -f "$webp" ] && [ "$(filesize "$webp")" -gt "$(filesize "$png")" ]; then
      "$IM" "$png" -define webp:lossless=true -define webp:method=6 "$webp" || true
   fi

   # Only trust a conversion we can read back as a real WebP.
   "$IM" identify "$webp" >/dev/null 2>&1 || return 1
}

convert_any() {
   # .png / .PNG in names too — the script should pick up everything.
   mapfile -d '' -t PNGS < <(find public -iname '*.png' -print0 | sort -z)
   if [ ${#PNGS[@]} -eq 0 ]; then
      echo "No PNG files in public/ — nothing to convert."
      return 0
   fi

   local total_png=0 total_webp=0 failed=0
   local png webp size webp_size

   [ "$DRY_RUN" -eq 1 ] && echo "Dry run — nothing will be changed." >&2

   for png in "${PNGS[@]}"; do
      webp="${png%.*}.webp"
      size="$(filesize "$png")"
      if [ "$DRY_RUN" -eq 1 ]; then
         echo "would convert: $png ($size bytes)"
      else
         if ! convert_one "$png"; then
            echo "conversion FAILED, keeping original: $png" >&2
            rm -f -- "$webp"
            failed=$((failed + 1))
            continue
         fi
         webp_size="$(filesize "$webp")"
         total_png=$((total_png + size))
         total_webp=$((total_webp + webp_size))
         rm -f -- "$png"
      fi
   done

   if [ "$DRY_RUN" -eq 0 ]; then
      if [ "$total_png" -gt 0 ]; then
         local saved=$((total_png - total_webp))
         local pct=$((saved * 100 / total_png))
         echo "Converted $(( ${#PNGS[@]} - failed )) file(s): $total_png -> $total_webp bytes ($pct% saved)"
      fi
      if [ "$failed" -gt 0 ]; then
         echo "Error: $failed file(s) failed to convert — original PNG(s) kept, their references left as-is." >&2
         return 1
      fi
   fi
}

# .png -> .webp in every markdown image reference in the repo.
# Only rewrites .png at the end of a path (before a closer, quote, whitespace,
# or end of line), so prose such as "see foo.png.backup" is left alone.
# PNGs that survived (failed conversions) are not rewritten to .webp: a line
# referencing any surviving png basename is left untouched.
update_md_refs() {
   mapfile -t MDS < <(find . -type d \( -name node_modules -o -name .next -o -name .git \) -prune -o \
                         \( -name '*.md' -o -name '*.mdx' \) -print | sort)
   local changed=0
   local md kept
   kept="$(find public -iname '*.png' -printf '%f\n' | sort -u || true)"

   for md in "${MDS[@]}"; do
      grep -qiE '\.png([")'"'"'[:space:]]|$)' "$md" || continue
      if [ "$DRY_RUN" -eq 1 ]; then
         echo "would update refs: $md ($(grep -ciE '\.png([")'"'"'[:space:]]|$)' "$md") line(s))"
      elif [ -z "$kept" ]; then
         sed -i -E 's/\.png([")'"'"'[:space:]]|$)/.webp\1/gI' "$md"
         echo "updated refs: $md"
      else
         # Some pngs still exist (failed conversions): keep lines whose refs
         # point at one of them, rewrite the rest.
         local tmp line base decision
         tmp="$(mktemp)"
         while IFS= read -r line; do
            if ! grep -qiE '\.png([")'"'"'[:space:]]|$)' <<< "$line"; then
               printf '%s\n' "$line"
               continue
            fi
            decision="rewrite"
            for base in $(grep -oE '[^()"'"'"'[:space:]]+\.png' <<< "$line" | xargs -r -n1 basename); do
               if printf '%s\n' "$kept" | grep -qiF -- "$base"; then
                  decision="keep"
                  break
               fi
            done
            if [ "$decision" = "rewrite" ]; then
               sed -E 's/\.png([")'"'"'[:space:]]|$)/.webp\1/gI' <<< "$line"
            else
               printf '%s\n' "$line"
            fi
         done < "$md" > "$tmp" && mv "$tmp" "$md"
         echo "updated refs: $md (kept .png refs for: $(tr '\n' ' ' <<< "$kept"))"
      fi
      changed=$((changed + 1))
   done
   if [ "$changed" -eq 0 ]; then
      echo "No .png references in markdown — nothing to update."
   fi
}

# Code/config files are reported, never rewritten automatically.
warn_code_refs() {
   local hits
   hits=$(grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
             --include='*.json' --include='*.mjs' --include='*.css' \
             '\.png' app lib next.config.ts 2>/dev/null || true)
   if [ -n "$hits" ]; then
      echo "WARNING: remaining .png references in code (update these manually):" >&2
      echo "$hits" >&2
   fi
}

CONVERT_FAILED=0
if ! convert_any; then
   CONVERT_FAILED=1
fi
# Still update references for the files that converted — failed PNGs are
# kept, so their references remain valid either way.
update_md_refs
warn_code_refs
if [ "$CONVERT_FAILED" -eq 1 ]; then
   echo "Error: not all files could be converted (see above)." >&2
   exit 1
fi
if [ "$DRY_RUN" -eq 1 ]; then
   echo "Dry run complete — nothing changed."
fi
