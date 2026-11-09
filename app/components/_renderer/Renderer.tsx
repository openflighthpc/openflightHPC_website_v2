import { getProject } from "@/public/projects/handler";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RendererProps = {
  projectName: string;
};

export default function Renderer({ projectName }: Readonly<RendererProps>) {
  const project = getProject(projectName);
  const markdownString = project.page;
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-lg prose-code:before:hidden prose-code:after:hidden">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {project.name}  {project.languages.join(' ')}  {project.tags.join(' ')}  {project.status}
      </h1>

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
