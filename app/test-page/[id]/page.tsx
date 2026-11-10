import { getAllProjects } from "@/lib/projects-handler";
import ExampleRenderer from "../../components/_renderer/Renderer";

type StencilProps = {
  text: string;
  repeat?: number;
};

function StencilText({ text, repeat = 1 }: Readonly<StencilProps>) {
  const rows = Array.from({ length: repeat });
  const doubled = `${text.toUpperCase()} ${text.toUpperCase()}`;

  return (
    <div
      aria-hidden
      className="pointer-events-none select-none whitespace-nowrap"
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="font-mono text-[10px] font-bold tracking-[0.3em] text-neutral-700"
        >
          {doubled}
        </div>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    id: project.id,
  }));
}

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Readonly<ProjectPageProps>) {
  const { id } = await params;

  return (
    <ExampleRenderer
      projectName={id}
      StencilText={StencilText}
    />
  );
}