'use client';

import { FaExternalLinkAlt } from 'react-icons/fa';

/**
 * An embed card for GitHub repos referenced in markdown by a paragraph
 * holding nothing but a `[github](repo-url)` link, similar to ProjectCard.
 * Repo
 * details are fetched from the public GitHub API on the client so the
 * static export always serves live data; on failure (offline, rate
 * limited) the card degrades to just the name and a link.
 */
export default function WebsiteCard({
   description,
   href,
   name
}: Readonly<{
   href: string;
   name: string;
   description?: string;
}>) {
   return (
      <a
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="group not-prose mx-auto my-8 block w-2/3 border border-neutral-800 bg-neutral-900/40 px-5 py-6 text-neutral-100 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.9)] transition-colors hover:border-lime-400/40 sm:px-8"
      >
         <div className="mx-auto max-w-2xl text-center">
            <FaExternalLinkAlt
               size={20}
               className="mx-auto text-neutral-300 transition-colors group-hover:text-lime-300"
            />

            <p className="mt-3 font-mono text-lg font-bold tracking-wide text-white sm:text-xl">
               {name}
            </p>

            <p className="mt-3 text-neutral-400">{description ?? 'A link to an external site'}</p>
            <p className="mt-1 group-hover:text-lime-300 break-all">{href}</p>
         </div>
      </a>
   );
}
