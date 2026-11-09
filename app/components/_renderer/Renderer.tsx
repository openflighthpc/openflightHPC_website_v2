import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RendererProps = {
  projectName: string;
};

export default function Renderer({ projectName }: RendererProps) {
  const markdownString = `
# Hello World

This is **bold** and this is *italic*.

- First item
- Second item

## Code example

\`\`\`typescript
const hello = "world";
console.log(hello);
\`\`\`

| Name | Age |
|---|---:|
| Alice | 25 |
| Bob | 30 |
`;
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-lg prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt, title }) {
            if (typeof src !== "string") return null;

            const resolvedSrc = resolveImagePath(src, projectName);

            return (
              <img
                src={resolvedSrc}
                alt={alt || ""}
                title={title}
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
            );
          },
        }}
      >
        {markdownString}
      </ReactMarkdown>
    </div>
  );
}

function resolveImagePath(src: string, projectName: string) {
  if (
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("/")
  ) {
    return src;
  }

  // Change based on where project files are
  return `/projects/${encodeURIComponent(projectName)}/${src.replace(/^\.\//, "")}`;
}
