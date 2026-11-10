import { getAllProjects, getProject } from '@/lib/projects-handler';
import ReactMarkdown from 'react-markdown';
import ProjectDossierLayout from './ProjectDossierLayout';
import { createMarkdownComponents, REMARK_PLUGINS } from './markdown-components';

type RendererProps = {
   projectName: string;
   StencilText?: React.FC<{ text: string; repeat?: number }>;
};

export default function MarkdownRenderer({ projectName, StencilText }: Readonly<RendererProps>) {
   const project = getProject(projectName);
   const allProjects = getAllProjects();
   const components = createMarkdownComponents(projectName, allProjects);

   return (
      <ProjectDossierLayout project={project} StencilText={StencilText}>
         <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components}>
            {project.summary}
         </ReactMarkdown>
         <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components}>
            {project.breakdown}
         </ReactMarkdown>
      </ProjectDossierLayout>
   );
}
