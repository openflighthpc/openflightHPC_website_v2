import ExampleRenderer from "../../components/_renderer/Renderer";

type StencilProps = {
  text: string;
  repeat?: number;
};

function StencilText({ text, repeat = 1 }: StencilProps) {
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return <ExampleRenderer projectName={name} StencilText={StencilText} />;
}
