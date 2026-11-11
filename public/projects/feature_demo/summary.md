# Markdown features

This page shows off the extras the site's markdown renderer adds on top of
normal markdown. Everything below goes through the renderer itself, so the
examples are the demos.

## 1. Code fences

Fences get shiki syntax highlighting. Whatever comes after the language tag
becomes the filename tab, and there's a copy button on the right:

```bash title=backup.sh
#!/usr/bin/env bash
SRC=$1
DEST=${2:-/var/backups}

mkdir -p "$DEST"
tar -czf "$DEST/backup-$(date +%F).tar.gz" "$SRC"
echo "backup written to $DEST"
```

```python title=notifier.py
import json
import urllib.request

def notify(event: dict, endpoint: str) -> int:
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(event).encode(),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request) as response:
        return response.status
```

Languages shiki doesn't know just come out plain instead of erroring:

```toml title=app.toml
[server]
host = "0.0.0.0"
port = 8000
debug = false
```

## 2. Inline code

Inline code is smaller and tinted green: `curl -s localhost:8000/health`.

## 3. Cross-project cards

A paragraph that only contains a project id in double brackets gets swapped
for a card for that project, status stamp and all. Take Hackathon-13:

[[Hackathon-13]]

An id that matches no project stays a normal inline span:
`[[does-not-exist]]`.

## 4. GitHub embeds

A paragraph holding nothing but a `[github](…)` link pointing at a repo
root becomes a card for that repository, with stars, forks and language
fetched live from the GitHub API. Take Phaser:

[github](https://github.com/phaserjs/phaser)

Deeper links (issues, trees, blobs) and links with other link text stay
ordinary anchors.

## 5. Before / after sliders

Two images in one paragraph, both with alt text starting with
`before|after`, turn into a draggable slider. Left side is desaturated,
right side is the original:

![before|after a colour grade](extras/old.webp)
![before|after a colour grade](extras/new.webp)

## 6. Videos

If the image extension is a video one (mp4, webm, ogg, mov, m4v) the
renderer puts down a `<video controls>` instead of an image. Hand written
`<video>` tags work too:

![a sample clip](extras/demo.mp4)

## 7. Regular markdown

The usual stuff still works: gfm tables, task lists, footnotes, links and
the rest.

- **bold**, _italic_, ~~strikethrough~~, [links](https://shiki.style)

| service | port | status |
| ------- | ---- | ------ |
| web     | 3000 | up     |
| api     | 8000 | up     |

> this is a blockquote. it exists to prove blockquotes work.
