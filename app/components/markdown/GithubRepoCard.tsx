'use client';

import { useEffect, useState } from 'react';

type GithubRepoCardProps = {
   owner: string;
   repo: string;
   href: string;
};

type RepoData = {
   description: string | null;
   stargazersCount: number;
   forksCount: number;
   language: string | null;
};

const FALLBACK_DESCRIPTION = 'GitHub repository';

const formatCount = (count: number) =>
   count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${count}`;

/**
 * An embed card for GitHub repos referenced in markdown by a paragraph
 * holding nothing but a `[github](repo-url)` link, similar to ProjectCard.
 * Repo
 * details are fetched from the public GitHub API on the client so the
 * static export always serves live data; on failure (offline, rate
 * limited) the card degrades to just the name and a link.
 */
export default function GithubRepoCard({ href, owner, repo }: Readonly<GithubRepoCardProps>) {
   const [repoData, setRepoData] = useState<RepoData | null>(null);

   useEffect(() => {
      let cancelled = false;

      fetch(`https://api.github.com/repos/${owner}/${repo}`)
         .then((response) => (response.ok ? response.json() : null))
         .then((data) => {
            if (cancelled || !data || typeof data.stargazers_count !== 'number') return;
            setRepoData({
               description: data.description ?? null,
               forksCount: data.forks_count ?? 0,
               language: data.language ?? null,
               stargazersCount: data.stargazers_count
            });
         })
         .catch(() => {
            // Rate limited or offline — the fallback card below still works.
         });

      return () => {
         cancelled = true;
      };
   }, [owner, repo]);

   return (
      <a
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="group not-prose mx-auto my-8 block w-2/3 border border-neutral-800 bg-neutral-900/40 px-5 py-6 text-neutral-100 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.9)] transition-colors hover:border-lime-400/40 sm:px-8"
      >
         <div className="mx-auto max-w-2xl text-center">
            <svg
               viewBox="0 0 16 16"
               width="18"
               height="18"
               fill="currentColor"
               aria-hidden
               className="mx-auto text-neutral-300 transition-colors group-hover:text-lime-300"
            >
               <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.6-.17-1.25-.25-1.9-.25s-1.3.08-1.9.25C4.27 3.34 3.6 3.56 3.6 3.56c-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>

            <p className="mt-3 font-mono text-lg font-bold tracking-wide text-white sm:text-xl">
               {owner}/{repo}
            </p>

            <p className="mt-3 text-neutral-400">{repoData?.description ?? FALLBACK_DESCRIPTION}</p>
         </div>

         <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
            {[
               { label: 'stars', value: repoData ? formatCount(repoData.stargazersCount) : '—' },
               { label: 'forks', value: repoData ? formatCount(repoData.forksCount) : '—' },
               { label: 'language', value: repoData?.language ?? '—' }
            ].map(({ label, value }) => (
               <div key={label} className="border border-neutral-800 bg-neutral-900/60 px-3 py-2">
                  <span className="text-neutral-500">{label}</span>
                  <span className="mx-2 text-neutral-700">/</span>
                  <span className="text-neutral-100">{value}</span>
               </div>
            ))}
         </div>
      </a>
   );
}
