import ExampleRenderer from "../../components/_renderer/Renderer";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

/* ————————————————————————————————————————————————
   Specimen file. The page is a concrete wall, the
   project is the thing being looked at. Dossier
   framing, stencilled metadata, one green accent.
   ———————————————————————————————————————————————— */

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

export default async function ProjectPage({ params }: Props) {
  const { name } = await params;

  return <ExampleRenderer projectName={name} StencilText={StencilText} />;
}
