# Renderer feature reference

The site's markdown renderer adds a handful of behaviours on top of standard
markdown. Every feature is demonstrated live on this project's summary page;
this file is the written reference.

## Syntax-highlighted code fences

Fences with a language tag are highlighted with
[shiki](https://shiki.style). Loaded languages include bash, javascript,
typescript, json, css, python, ruby, dockerfile and diff; any other language
renders as plain text in the same frame instead of failing.

Text after the language in the fence opener becomes a filename tab:

````md
```css title=theme.css
:root {
   --accent: #9be29b;
}
```
````

## Inline code

Inline spans are rendered smaller, tinted green, and keep their monospace
font: `npm run build`.
