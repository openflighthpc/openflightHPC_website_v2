'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
   const pathname = usePathname();
   const isProjectsPage = pathname === '/projects' || pathname.startsWith('/projects/');

   return (
      <header className="sticky top-0 z-80 flex h-16 w-full items-center justify-between bg-black/80 px-8 text-white backdrop-blur sm:px-16">
         <Link href="/" className="cursor-pointer">
            <Image
               src="/openflightHPC_website_v2/header_logo.svg"
               width={221}
               height={40}
               alt="OpenFlight Labs"
               className="h-auto w-40 sm:w-[221px]"
            />
         </Link>
         <Link
            href="/projects"
            aria-current={isProjectsPage ? 'page' : undefined}
            className={`font-bold text-lg sm:text-xl transition hover:text-green-400/70 ${isProjectsPage ? 'text-[#1A9B65]' : ''}`}
         >
            Projects
         </Link>
      </header>
   );
}
