import type { Project } from '@/lib/project-handler';
import type { Element as HastElement, Text as HastText } from 'hast';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import BeforeAfterSlider from './BeforeAfterSlider';
import CodeBlock from './CodeBlock';
import ProjectCard from './ProjectCard';
import { resolveImagePath } from './paths';

type MdastNode = {
   type: string;
   meta?: string;
   data?: { hProperties?: Record<string, string> };
   children?: MdastNode[];
};

/** Matches a bare `[[project-id]]` reference, inline or sole in a paragraph. */
const PROJECT_REF_PATTERN = /^\[\[([a-z0-9-]+)\]\]$/i;

/**
 * Copies a fenced code block's info-string meta into `data.hProperties` so
 * it survives into the hast `code` element's properties, e.g.
 * ```bash title=backup.sh → properties.meta === 'title=backup.sh'.
 */
function remarkCodeMeta() {
   return (tree: unknown) => {
      const visitNode = (node: MdastNode) => {
         if (node.type === 'code' && node.meta) {
            node.data = { ...node.data, hProperties: { meta: node.meta } };
         }
         node.children?.forEach(visitNode);
      };
      visitNode(tree as MdastNode);
   };
}

/** Remark plugins applied to every markdown source rendered on the page. */
export const REMARK_PLUGINS = [remarkGfm, remarkCodeMeta];

function hastTextContent(node: HastElement): string {
   return node.children
      .map((child) =>
         child.type === 'text'
            ? child.value
            : child.type === 'element'
              ? hastTextContent(child)
              : ''
      )
      .join('');
}

/**
 * The react-markdown `components` overrides that implement the project's
 * custom markdown features: raw video tags, dossier cards for
 * `[[project-id]]` references, before/after comparison sliders and
 * shiki-highlighted code fences. Behaviour only — the page chrome and its
 * styling live in `ProjectDossierLayout.tsx`.
 */
export function createMarkdownComponents(
   projectName: string,
   // Powers the `[[project-id]]` → ProjectCard lookups.
   allProjects: Project[]
): Components {
   return {
      img({ src, alt }) {
         if (typeof src !== 'string') return null;

         // A raw <video> tag falls back to the img component with the whole
         // tag leaked into `alt`, so only keep a genuine alt text.
         const altText = alt && alt !== src ? alt : '';

         if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(src)) {
            return (
               <video
                  src={resolveImagePath(src, projectName)}
                  controls
                  className="max-w-full rounded-sm"
               />
            );
         }

         return (
            <Image
               src={resolveImagePath(src, projectName)}
               alt={altText}
               width={1200}
               height={800}
               className="grayscale-[35%] max-w-full h-auto rounded-sm"
               sizes="(max-width: 768px) 100vw, 768px"
            />
         );
      },
      video({ src, children }) {
         if (typeof src !== 'string') return null;

         return (
            <video
               src={resolveImagePath(src, projectName)}
               controls
               className="max-w-full rounded-sm"
            >
               {children}
            </video>
         );
      },
      pre({ node, children }) {
         // The <pre> wrapper is replaced by CodeBlock, which owns the frame,
         // so fenced code never reaches the `code` override below.
         const codeEl = node?.children.find(
            (child): child is HastElement => child.type === 'element' && child.tagName === 'code'
         );

         if (!codeEl) return <>{children}</>;

         const className = (codeEl.properties.className as string[] | undefined) ?? [];
         const lang = className
            .find((cls) => cls.startsWith('language-'))
            ?.replace('language-', '');
         // `meta` is delivered as an attribute by the remarkCodeMeta plugin,
         // with the hast node's data field as a fallback.
         const meta =
            (codeEl.properties.meta as string | undefined) ??
            (codeEl.data as { meta?: string } | undefined)?.meta;

         return <CodeBlock code={hastTextContent(codeEl)} lang={lang} meta={meta} />;
      },
      code({ className, children }) {
         const raw = String(children);

         // Inline `[[project-id]]` references render as dossier cards.
         const refMatch = !className ? raw.match(PROJECT_REF_PATTERN) : undefined;
         if (refMatch) {
            const referenced = allProjects.find(
               (candidate) => candidate.id.toLowerCase() === refMatch[1].toLowerCase()
            );
            if (referenced) return <ProjectCard project={referenced} />;
         }

         return <code className="font-mono text-[0.85em] text-lime-200/90">{children}</code>;
      },
      p({ node, children }) {
         // A paragraph holding only a bare `[[project-id]]` reference renders
         // as a dossier card for that project.
         const paraChildren = node?.children ?? [];
         const soleText =
            paraChildren.length === 1 && paraChildren[0].type === 'text'
               ? (paraChildren[0] as HastText)
               : undefined;
         const soleRef = soleText?.value.match(PROJECT_REF_PATTERN);

         if (soleRef) {
            const referenced = allProjects.find(
               (candidate) => candidate.id.toLowerCase() === soleRef[1].toLowerCase()
            );
            if (referenced) return <ProjectCard project={referenced} />;
         }

         // Two adjacent images in one paragraph whose alt text starts with
         // `before|after` collapse into a draggable comparison slider.
         const images = (node?.children ?? []).filter(
            (child): child is HastElement => child.type === 'element' && child.tagName === 'img'
         );

         if (
            images.length === 2 &&
            images.every((image) =>
               /^before\s*\|\s*after/i.test(String(image.properties.alt ?? ''))
            )
         ) {
            const [before, after] = images;
            return (
               <BeforeAfterSlider
                  beforeSrc={resolveImagePath(String(before.properties.src), projectName)}
                  beforeAlt={String(before.properties.alt)}
                  afterSrc={resolveImagePath(String(after.properties.src), projectName)}
                  afterAlt={String(after.properties.alt)}
               />
            );
         }

         return <p>{children}</p>;
      }
   };
}
