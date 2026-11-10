# Markdown Feature Tour

A live exhibit of everything the site's markdown renderer adds on top of
standard markdown. Each feature is demonstrated on this very page — the
syntax shown is the demo.

## 1. Syntax-highlighted code fences

Code fences are coloured with the
[shiki](https://shiki.style) highlighter. Text after the language in the
fence opener becomes a filename tab, and a copy button sits at the right:

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

Languages the highlighter doesn't know still render — plain text inside
the same chrome, no crash:

```toml title=app.toml
[server]
host = "0.0.0.0"
port = 8000
debug = false
```

## 2. Inline code

Inline spans render smaller, with a soft green tint:
`curl -s localhost:8000/health`.

## 3. Cross-project cards

A paragraph that is nothing but a project id in double brackets —
`[[project-id]]` — embeds that project's dossier card, stamped with its
status and linking to its page. This one points at a real project:

[[Hackathon-13]]

An unknown id degrades to a harmless inline span: `[[does-not-exist]]`.

## 4. Before / after sliders

A paragraph containing exactly two images whose alt text begins with
`before|after` collapses into a draggable comparison slider. Drag the
divider between a desaturated photo and a colour-graded one:

![before|after a colour grade](extras/old.png)
![before|after a colour grade](extras/new.png)

## 5. Video embeds

Image syntax whose path ends in a video extension (`.mp4`, `.webm`,
`.ogg`, `.mov`, `.m4v`) renders a playable `<video controls>` element
instead of an image. Raw `<video>` tags work too:

![a sample clip](extras/demo.mp4)

## 6. Everything else still works

Standard markdown is untouched:

- **bold**, _italic_, ~~strikethrough~~, [links](https://shiki.style)
- task lists, footnotes and autolinks via remark-gfm

| service | port | status |
| ------- | ---- | ------ |
| web     | 3000 | up     |
| api     | 8000 | up     |

> good demos are short.
