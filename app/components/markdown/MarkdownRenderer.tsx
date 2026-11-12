import ReactMarkdown from 'react-markdown';

import { getAllProjects, getProject } from '@/lib/project-handler';

import { createMarkdownComponents, REMARK_PLUGINS } from './MarkdownComponents';
import ProjectDossierLayout from './ProjectDossierLayout';

/**
 * Renders the markdown converting basic markdown into the enhanced version
 * @param projectName The name of the project
 * @param stencilText The stencil text for the page
 * @returns The rendered markdown
 */
export default function MarkdownRenderer({
   projectName,
   stencilText
}: Readonly<{
   projectName: string;
   stencilText?: React.FC<{ text: string; repeat?: number }>;
}>) {
   const project = getProject(projectName);
   const allProjects = getAllProjects();
   const components = createMarkdownComponents(projectName, allProjects);

   return (
      <ProjectDossierLayout
         project={project}
         StencilText={stencilText}
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
