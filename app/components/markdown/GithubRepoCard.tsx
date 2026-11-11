'use client';

import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

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
            <FaGithub
               className="mx-auto text-neutral-300 transition-colors group-hover:text-lime-300"
               size={20}
            />

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
