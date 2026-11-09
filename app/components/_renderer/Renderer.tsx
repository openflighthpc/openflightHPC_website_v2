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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownString}
      </ReactMarkdown>
    </div>
  );
}
