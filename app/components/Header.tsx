'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoReorderTwoOutline } from 'react-icons/io5';

const navigationLinks = [
   { href: '/projects', label: 'projects' },
   { href: '/timeline', label: 'timeline' }
];

const mobileLinks = [
   { href: '/', label: 'home' },
   { href: '/projects', label: 'projects' },
   { href: '/timeline', label: 'timeline' }
];

export default function Header() {
   const pathname = usePathname();
   const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

   return (
      <header className="sticky top-0 z-80 flex h-16 w-full items-center justify-between bg-black/80 px-8 mt-4 text-white sm:px-16">
         <Link href="/" className="cursor-pointer">
            <Image
               src="/header_logo.svg"
               width={221}
               height={40}
               alt="OpenFlight Labs"
               className="h-auto w-50 sm:w-[250px]"
            />
         </Link>

         <nav
            aria-label="Main"
            className="hidden items-center gap-6 text-lg font-bold tracking-widest md:flex md:gap-10 md:text-xl"
         >
            {navigationLinks.map((link) => (
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

         <MobileNavigation key={pathname} isActive={isActive} />
      </header>
   );
}

function MobileNavigation({ isActive }: Readonly<{ isActive: (href: string) => boolean }>) {
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
      document.body.style.overflow = menuOpen ? 'hidden' : '';

      return () => {
         document.body.style.overflow = '';
      };
   }, [menuOpen]);

   return (
      <>
         <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="cursor-pointer transition hover:text-green-500 md:hidden"
            onClick={() => setMenuOpen(true)}
         >
            <IoReorderTwoOutline aria-hidden="true" size={32} />
         </button>

         {menuOpen && (
            <nav
               aria-label="Mobile navigation"
               className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto overscroll-contain gap-6 bg-black text-4xl font-bold tracking-widest md:hidden"
            >
               <button
                  type="button"
                  aria-label="Close menu"
                  className="absolute right-10 top-10 cursor-pointer transition hover:text-green-400"
                  onClick={() => setMenuOpen(false)}
               >
                  <X aria-hidden="true" size={38} />
               </button>
               {mobileLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     aria-current={isActive(link.href) ? 'page' : undefined}
                     className={`transition hover:text-green-400/70 ${isActive(link.href) ? 'text-green-400' : ''}`}
                     onClick={() => setMenuOpen(false)}
                  >
                     {link.label}
                  </Link>
               ))}
            </nav>
         )}
      </>
   );
}
