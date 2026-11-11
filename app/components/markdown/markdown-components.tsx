import type { Element as HastElement, Text as HastText } from 'hast';
import Image from 'next/image';
import { Children } from 'react';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Project } from '@/lib/project-handler';

import BeforeAfterSlider from './BeforeAfterSlider';
import CodeBlock from './CodeBlock';
import GithubRepoCard from './GithubRepoCard';
import { resolveImagePath } from './paths';
import ProjectCard from './ProjectCard';
import remarkCollapse from './remarkCollapse';

type MdastNode = {
   type: string;
   meta?: string;
   data?: { hProperties?: Record<string, string> };
   children?: MdastNode[];
};

/** Matches a bare `[[project-id]]` reference, inline or sole in a paragraph. */
const PROJECT_REF_PATTERN = /^\[\[([a-z0-9-]+)\]\]$/i;

/** Matches a github.com repo root URL and extracts owner and repo name. */
const GITHUB_REPO_PATTERN = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/;

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
export const REMARK_PLUGINS = [remarkGfm, remarkCodeMeta, remarkCollapse];

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
      code({ children, className }) {
         const raw = String(children);

         // Inline `[[project-id]]` references render as dossier cards.
         const refMatch = !className ? new RegExp(PROJECT_REF_PATTERN).exec(raw) : undefined;
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
      img({ alt, src }) {
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
            const repoRef = githubHref.match(GITHUB_REPO_PATTERN);
            if (repoRef) {
               return <GithubRepoCard owner={repoRef[1]} repo={repoRef[2]} href={githubHref} />;
            }
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
      summary({ children }) {
         return (
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
         );
      },
      video({ children, src }) {
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
      }
   };
}
