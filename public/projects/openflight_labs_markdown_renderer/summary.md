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

[project](hackathon_13)

An id that matches no project stays a normal inline span:
`[[does-not-exist]]`.

## 4. GitHub embeds

A paragraph holding nothing but a `[github](…)` link pointing at a repo
root becomes a card for that repository, with stars, forks and language
fetched live from the GitHub API. Take Phaser:

[github](https://github.com/codecrafters-io/build-your-own-x)

Deeper links (issues, trees, blobs) and links with other link text stay
ordinary anchors.

## 5. Collapsible sections

A `:::collapse` container becomes a native `<details>` panel that readers
can expand and collapse. The state keyword sets the default state — `open`
or `closed` (the default if omitted) — and the rest of the line is the
visible title. The closing `:::` only needs to be on its own line, so a
collapse written without blank lines still terminates correctly:

:::collapse open An open-by-default section
Everything inside the container can be any markdown — paragraphs,
lists, code fences, cards, whatever.
:::

:::collapse A closed-by-default section
Note the state keyword is optional; closed is the default. Nested
containers work too.
:::

:::page-break

## 6. Before / after sliders

Two images in one paragraph, both with alt text starting with
`before|after`, turn into a draggable slider. Left side is desaturated,
right side is the original:

![before|after a colour grade](extras/old.webp)
![before|after a colour grade](extras/new.webp)

## 7. Videos

If the image extension is a video one (mp4, webm, ogg, mov, m4v) the
renderer puts down a `<video controls>` instead of an image. Hand written
`<video>` tags work too:

![a sample clip](extras/demo.mp4)

## 8. Tabs

A `:::tabs` container turns its content into client-side tabs. The header
line after `:::tabs` is a pipe-separated list of labels, and each panel
is bounded by its own `:::Label` line and a closing `:::` — so a panel
can hold any number of blocks, not just one paragraph. Try switching:

:::tabs Setup | Run
:::Setup
Install the bundle, then submit the job to the queue.

This panel holds two paragraphs; the blank line between them is fine.
:::

:::Run
Second panel — anything markdown can do works here: `inline code`,
_emphasis_, images, even lists:

- one
- two

:::
:::

:::tabs Bash | Notes
:::Bash

```bash title=run.sh
echo "Hello world"
```

:::

:::Notes
The panel above held a code fence — it renders exactly as it would
outside a tabset.
:::
:::

## 9. Spoilers

`||…||` around inline content blurs it until the reader clicks. A word,
an image and a video, all hidden:

The secret word is ||verisimilitude||, and this image is ||![a hidden image](extras/old.webp)||
so is this clip: ||![a hidden clip](extras/demo.mp4)||

## 10. Regular markdown

The usual stuff still works: gfm tables, task lists, footnotes, links and
the rest.

- **bold**, _italic_, ~~strikethrough~~, [links](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

| service | port | status |
| ------- | ---- | ------ |
| web     | 3000 | up     |
| api     | 8000 | up     |

> this is a blockquote. it exists to prove blockquotes work.

## 11. Website card

A paragraph that only contains a `[pretty-link:::title:::description](…)` link pointing at a website
becomes a card for that website, with title and description.

[pretty-link:::pretty.io:::this is just a test page link](https://pretty-link.io)
