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
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownString}
      </ReactMarkdown>
    </div>
  );
}
