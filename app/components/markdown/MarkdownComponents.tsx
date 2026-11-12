import type { Element as HastElement, Text as HastText } from 'hast';
import Image from 'next/image';
import { Children, type ComponentType, type ReactNode } from 'react';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Project } from '@/lib/project-handler';

import { resolveImagePath } from './assets/paths';
import BeforeAfterSlider from './BeforeAfterSlider';
import GithubRepoCard from './cards/GithubRepoCard';
import ProjectCard from './cards/ProjectCard';
import WebsiteCard from './cards/WebsiteCard';
import CodeBlock from './codeBlock/CodeBlock';
import remarkCollapse from './collapse/remarkCollapse';
import remarkSpoiler from './spoilers/remarkSpoiler';
import Spoiler from './spoilers/Spoiler';
import MarkdownTabs from './tabs/MarkdownTabs';
import remarkTabs from './tabs/remarkTabs';

type MdastNode = {
   type: string;
   meta?: string;
   data?: { hProperties?: Record<string, string> };
   children?: MdastNode[];
};
/** Matches a bare `[[project-id]]` reference, inline or sole in a paragraph. */
const PROJECT_REF_PATTERN = /^\[\[([a-z0-9 _-]+)\]\]$/i;

/** Matches a github.com repo root URL and extracts owner and repo name. */
const GITHUB_REPO_PATTERN = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/;

/** Class name the remarkSpoiler plugin stamps on spoiler wrapper spans. */
const SPOILER_CLASS = 'spoiler';

/** Element name the remarkTabs plugin gives its custom container node. */
const TABSET_ELEMENT = 'tabset';

/** Element name the remarkTabs plugin gives each panel wrapper node. */
const TABPANEL_ELEMENT = 'tabpanel';

/**
 * Copies a fenced code block's info-string meta into `data.hProperties` so
 * it survives into the hast `code` element's properties, e.g.
 * ```bash title=backup.sh → properties.meta === 'title=backup.sh'.
 */
const remarkCodeMeta = () => (tree: unknown) => {
   const visitNode = (node: MdastNode) => {
      if (node.type === 'code' && node.meta) {
         node.data = { ...node.data, hProperties: { meta: node.meta } };
      }
      node.children?.forEach(visitNode);
   };
   visitNode(tree as MdastNode);
};

/**
 * Remark plugins applied to every markdown source rendered on the page.
 * remarkTabs must run *before* remarkCollapse: both treat a bare `:::`
 * line as a closer, and running container-splitting collapse-first eats
 * tab closers — silently swallowing everything after a tabs container
 * into its panels.
 */
export const REMARK_PLUGINS = [
   remarkGfm,
   remarkCodeMeta,
   remarkTabs,
   remarkCollapse,
   remarkSpoiler
];

const hastTextContent = (node: HastElement): string =>
   node.children
      .map((child) =>
         child.type === 'text'
            ? child.value
            : child.type === 'element'
              ? hastTextContent(child)
              : ''
      )
      .join('');

/**
 * The react-markdown `components` overrides that implement the project's
 * custom markdown features: raw video tags, dossier cards for
 * `[[project-id]]` references, before/after comparison sliders,
 * `:::tabs` tabsets and shiki-highlighted code fences. Behaviour
 * only — the page chrome and its styling live in
 * `ProjectDossierLayout.tsx`.
 */
export function createMarkdownComponents(
   projectName: string,
   // Powers the `[[project-id]]` → ProjectCard lookups.
   allProjects: Project[]
): Components {
   const components: Components = {
      code({ children, className }) {
         // Inline `[[project-id]]` references render as dossier cards.
         const refMatch = !className
            ? new RegExp(PROJECT_REF_PATTERN).exec(String(children))
            : undefined;
         if (refMatch) {
            const referenced = allProjects.find(
               (candidate) => candidate.id.toLowerCase() === refMatch[1].toLowerCase()
            );
            if (referenced) return <ProjectCard project={referenced} />;
         }

         return <code className="font-mono text-[0.85em] text-lime-200/90">{children}</code>;
      },
      details({ children, node, open, ...props }) {
         // Everything after the summary is padded; the summary keeps its
         // own padding so its bottom border stays full-bleed.
         const [summary, ...content] = Children.toArray(children);

         return (
            <details
               {...props}
               open={open}
               className="group/details my-8 border border-neutral-800 bg-neutral-900/40 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.9)]"
            >
               {summary}
               {content.length > 0 && <div className="px-5 pb-4 sm:px-8">{content}</div>}
            </details>
         );
      },
      img({ alt, children, src }) {
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
               >
                  <track kind="captions" />
                  {children}
               </video>
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
      p({ children, node }) {
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

         // A paragraph holding nothing but a `[github](repo-url)` link
         // renders as a repo embed card for that repository.
         const soleAnchor =
            paraChildren.length === 1 && paraChildren[0].type === 'element'
               ? (paraChildren[0] as HastElement)
               : undefined;

         const githubHref =
            soleAnchor?.tagName === 'a' && hastTextContent(soleAnchor).toLowerCase() === 'github'
               ? String(soleAnchor.properties.href ?? '')
               : undefined;

         if (githubHref) {
            const repoRef = new RegExp(GITHUB_REPO_PATTERN).exec(githubHref);
            if (repoRef) {
               return <GithubRepoCard owner={repoRef[1]} repo={repoRef[2]} href={githubHref} />;
            }
         }

         if (
            soleAnchor?.tagName === 'a' &&
            hastTextContent(soleAnchor).toLowerCase().startsWith('pretty-link')
         ) {
            const [, name, description] = hastTextContent(soleAnchor)
               .toLocaleLowerCase()
               .split(':::');
            return (
               <WebsiteCard
                  name={name}
                  href={String(soleAnchor.properties.href ?? '')}
                  description={description}
               ></WebsiteCard>
            );
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
      },
      pre({ children, node }) {
         // The <pre> wrapper is replaced by CodeBlock, which owns the frame,
         // so fenced code never reaches the `code` override below.
         const codeEl = node?.children.find(
            (child): child is HastElement => child.type === 'element' && child.tagName === 'code'
         );

         if (!codeEl) return <>{children}</>;

         return (
            <CodeBlock
               code={hastTextContent(codeEl)}
               lang={((codeEl.properties.className as string[] | undefined) ?? [])
                  .find((cls) => cls.startsWith('language-'))
                  ?.replace('language-', '')}
               meta={
                  (codeEl.properties.meta as string | undefined) ??
                  (codeEl.data as { meta?: string } | undefined)?.meta
               }
            />
         );
      },
      // The remarkSpoiler plugin wraps `||…||` regions in spans carrying
      // the spoiler class; render them as clickable reveal components.
      span: ({ children, node, ...props }) =>
         !((node?.properties?.className as string[] | undefined) ?? []).includes(SPOILER_CLASS) ? (
            <span {...props}>{children}</span>
         ) : (
            <Spoiler>{children}</Spoiler>
         ),
      summary: ({ children }) => (
         <summary className="block cursor-pointer list-none border-b border-neutral-800 px-5 py-4 font-bold tracking-wide transition-colors hover:text-lime-300 sm:px-8">
            <span className="flex items-center justify-between gap-4">
               <span>{children}</span>
               <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  className="shrink-0 text-lime-400/70 transition-transform group-open/details:rotate-180"
               >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
               </svg>
            </span>
         </summary>
      ),
      video: ({ children, src }) =>
         typeof src !== 'string' ? null : (
            <video
               src={resolveImagePath(src, projectName)}
               controls
               className="max-w-full rounded-sm"
            >
               <track kind="captions" />
               {children}
            </video>
         )
   };

   // The remarkTabs plugin emits custom `tabset`/`tabpanel` elements, which
   // have no intrinsic keys in react-markdown's `Components` map; hook the
   // client component on with the loose keys the runtime lookup actually
   // uses. The tabpanel wrapper is a plain passthrough div — MarkdownTabs
   // reads each panel's label off its `data-*` props. Unmapped tab panels
   // would render as unknown literal elements, so both keys are required.
   const looseComponents = components as Record<
      string,
      ComponentType<{
         children?: ReactNode;
         className?: string;
         'data-label'?: string;
         'data-index'?: string;
      }>
   >;
   looseComponents[TABSET_ELEMENT] = MarkdownTabs;
   looseComponents[TABPANEL_ELEMENT] = function TabPanel({
      children,
      className,
      'data-index': dataIndex,
      'data-label': dataLabel
   }) {
      return (
         <div data-label={dataLabel} data-index={dataIndex} className={className}>
            {children}
         </div>
      );
   };

   return components;
}
