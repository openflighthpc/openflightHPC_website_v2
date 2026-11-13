'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
   { href: '/projects', label: 'projects' },
   { href: '/timeline', label: 'timeline' }
];

export default function Header() {
   const pathname = usePathname();
   const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

   return (
      <header className="sticky top-0 z-80 pt-4 flex h-16 w-full items-center justify-between bg-black/80 px-8 text-white backdrop-blur sm:px-16">
         <Link href="/" className="cursor-pointer">
            <Image
               src="/header_logo.svg"
               width={221}
               height={40}
               alt="OpenFlight Labs"
               className="h-auto w-40 sm:w-[250px]"
            />
         </Link>
         <nav
            aria-label="Main"
            className="flex items-center gap-6 text-lg font-bold tracking-widest sm:gap-10 sm:text-xl"
         >
            {navLinks.map((link) => (
               <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`transition hover:text-green-400/70 ${isActive(link.href) ? 'text-green-400' : ''}`}
               >
                  {link.label}
               </Link>
            ))}
         </nav>
      </header>
   );
}
