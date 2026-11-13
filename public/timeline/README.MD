# TIMELINE ENTRIES

Every markdown file in this folder appears on the `/timeline` page as an item. Registered
projects are added to the timeline automatically, so this folder is for anything the project
pages do not cover already, such as releases, talks, awards or notable milestones.

## HOW TO ADD AN ENTRY

1. Create a markdown file in this folder. The file name is only used as the entry id, so
   give it a short descriptive name, for example `2026-11-14-first-pull.md`.
2. Start the file with a frontmatter block containing a `date` (dd/mm/yyyy to match the rest
   of the site) and a `title`. The body below the block is simple markdown shown on the entry.

```md
---
date: 14/11/2026
title: Example entry
---

The body of the entry, written in simple markdown.
```

Optional frontmatter:

- `colour` — the hex colour of the timeline node, for example `colour: '#2f76a6'`.
  Defaults to a neutral grey.
- `project` — the id of a registered project folder, for example `project: flight_solo`,
  which links the entry to that project's page.

On a tie the timeline shows projects before entries. Everything is spaced evenly along the
line with the most recent item at the top.
