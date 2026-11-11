import MarkdownRenderer from '@/app/components/markdown/MarkdownRenderer';
import { getAllProjects } from '@/lib/project-handler';

function StencilText({
   text,
   repeat = 1
}: Readonly<{
   text: string;
   repeat?: number;
}>) {
   const rows = Array.from({ length: repeat });
   const doubled = `${text.toUpperCase()} ${text.toUpperCase()}`;

   return (
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap">
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

export async function generateStaticParams() {
   return (await getAllProjects()).map((project) => ({
      id: project.id
   }));
}

export default async function ProjectPage({
   params
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;

   return <MarkdownRenderer projectName={id} StencilText={StencilText} />;
}
