import ReactMarkdown from 'react-markdown';

import { getAllProjects, getProject } from '@/lib/project-handler';

import { createMarkdownComponents, REMARK_PLUGINS } from './MarkdownComponents';
import ProjectDossierLayout from './ProjectDossierLayout';

type RendererProps = {
   projectName: string;
   StencilText?: React.FC<{ text: string; repeat?: number }>;
};

export default function MarkdownRenderer({ projectName, StencilText }: Readonly<RendererProps>) {
   const project = getProject(projectName);
   const allProjects = getAllProjects();
   const components = createMarkdownComponents(projectName, allProjects);

   return (
      <ProjectDossierLayout
         project={project}
         StencilText={StencilText}
         summary={
            <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components}>
               {project.summary}
            </ReactMarkdown>
         }
         breakdown={
            project.breakdown.trim() ? (
               <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components}>
                  {project.breakdown}
               </ReactMarkdown>
            ) : null
         }
      />
   );
}
