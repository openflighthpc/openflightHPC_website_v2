import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
   return (
      <header className="mx-8 flex h-16 items-center justify-between bg-black/80 text-white backdrop-blur sm:mx-16">
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
            className="font-bold text-lg sm:text-xl transition hover:text-green-400/70"
         >
            Projects
         </Link>
      </header>
   );
}
