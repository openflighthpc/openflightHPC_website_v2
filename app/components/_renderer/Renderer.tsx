import { getProject } from "@/public/projects/handler";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RendererProps = {
  projectName: string;
};

export default function Renderer({ projectName }: RendererProps) {
  const project = getProject(projectName);
  const markdownString = project.page;
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-lg prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt }) {
            if (typeof src !== "string") return null;

            const resolvedSrc = resolveImagePath(src, projectName);

            return (
              <Image
                src={resolvedSrc}
                alt={alt || ""}
                width={1200}
                height={800}
                className="rounded-lg max-w-full h-auto"
                sizes="(max-width: 768px) 100vw, 768px"
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
