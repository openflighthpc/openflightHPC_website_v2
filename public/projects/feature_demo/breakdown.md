# Renderer feature reference

Notes on what the site's markdown renderer does beyond normal markdown.
Each feature has a working example on the summary page.

## Code fences

Fences with a language tag are highlighted with shiki. bash, javascript,
typescript, json, css, python, ruby, dockerfile and diff are loaded, and
anything else comes out as plain text rather than an error. Text after the
language tag becomes the filename tab:

````md
```css title=theme.css
:root {
   --accent: #9be29b;
}
```
````

## Inline code

Smaller than body text, tinted green, still monospace: `npm run build`.

## Cross-project cards

If a paragraph is just a project id in double brackets it becomes a card
for that project, with its status stamp and a link to its page:

```md
[[my-project]]
```

The id is matched against project folder names, case insensitive. If no
project has that id you just get the span back as plain inline code.

## GitHub embeds

A paragraph that is nothing but a `[github](…)` link at a repository root
becomes an embed card with live repo stats:

```md
[github](https://github.com/phaserjs/phaser)
```

Links with other link text, or URLs deeper than the repo root, stay
ordinary anchors.

## Collapsible sections

A `:::collapse` container renders as a native `<details>` panel. The line
after the opening marker can carry an `open` or `closed` state keyword and
the title to display:

```md
:::collapse open An open-by-default section
any markdown in here
:::

:::collapse A closed-by-default section
the state keyword is optional, closed is the default
:::
```

Containers can be nested. The closing `:::` only needs to be on its own
line — blank lines around it are not required, though they are allowed.

## Tabs

A `:::tabs` container renders its panels as client-side tabs. The opening
marker line carries a pipe-separated list of labels, one per panel, in
panel order. Within the container, each panel starts with a `:::Label`
line and ends with a bare `:::`; the final `:::` closes the tabset
itself:

```md
:::tabs Setup | Run | Results
:::Setup
install and configure everything
:::

:::Run
submit the job
:::
:::
```

A bare `:::` line always closes the innermost open block, so panels and
tabsets never need to be counted — `:::` closes the panel when one is
open, otherwise the tabset. Blank lines around the markers are optional.
Everything the renderer supports — fences, images, spoilers, cards —
works inside a panel, and a panel can hold any number of blocks, not
just one paragraph. Any content before the first `:::Label` becomes an
unlabelled first panel. Tabs are not designed to be nested inside other
tabs, and collapse containers should stay outside tabsets: a `:::` line
inside a panel always closes the panel, never a collapse block.

## Before / after sliders

Two images in one paragraph, both alt texts starting with `before|after`,
become a draggable slider. First image is the before, second is the after:

```md
![before|after the grade](extras/old.webp)
![before|after the grade](extras/new.webp)
```

## Videos

An image path ending in a video extension (mp4, webm, ogg, mov, m4v)
renders a `<video controls>` instead of an image, so a screencast can go
where a screenshot would:

```md
![a walkthrough of the tool](extras/demo.mp4)
```

Hand written `<video>` tags are passed through too, which is how you would
get poster images or multiple sources in.

## Spoilers

Double pipes around inline content blur it out until the reader clicks:

```md
||a hidden word||
||![a hidden image](extras/old.webp)||
||![a hidden clip](extras/demo.mp4)||
```

Works around words, images and videos. Inline code and code fences are
untouched, and an unclosed `||` stays plain text.

## Everything else

Headings, lists, tables, task lists, footnotes, quotes, links. All plain
markdown via remark-gfm, images go through next/image. Image and video
paths are resolved relative to the project's own folder, so `extras/…`
means that project's assets.

## Website cards

A paragraph that only contains a `[pretty-link:::<title>:::<description>](…)` link pointing at a website
becomes a card for that website, with title and description.

```md
[pretty-link:::pretty.io:::this is just a test page link](https://pretty-link.io)
```
