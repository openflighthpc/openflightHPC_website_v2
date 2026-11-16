import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/app/components/Footer';

export default function NotFound() {
   return (
      <>
         <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center text-[#f8f8f8]">
            <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0">
               <Image
                  src="/bumcloud_white.svg"
                  alt=""
                  width={640}
                  height={445}
                  className="w-72 opacity-30 blur-[1px] sm:w-96"
               />
            </div>

            <p
               aria-hidden="true"
               className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-8xl font-bold tracking-tight text-transparent sm:text-9xl"
            >
               404
            </p>

            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
               This page drifted off into the clouds
            </h1>

            <p className="mt-3 max-w-md text-lg text-zinc-400">
               The page you were looking for doesn&apos;t exist or has moved.
            </p>

            <Link
               href="/"
               className="mt-10 rounded-full bg-white px-6 py-3 font-bold text-black transition duration-200 hover:bg-white/80"
            >
               Back to the homepage
            </Link>
         </main>
         <Footer />
      </>
   );
}
