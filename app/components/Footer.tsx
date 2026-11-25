'use client';

import Image from 'next/image';

export default function Footer() {
   return (
      <footer className=" z-80 flex h-40 w-full items-end justify-between bg-black/80 text-white backdrop-blur">
         <Image
            src="/parting_cloud_l.svg"
            width={288}
            height={150}
            alt=""
            className="h-auto w-[30%] max-w-72 shrink-0"
         />

         <div className="flex min-w-0 flex-1 flex-col items-center self-center px-2">
            <Image
               src="/header_logo.svg"
               width={288}
               height={150}
               alt="OpenFlight Labs"
               className="h-auto w-full max-w-[400px]"
            />
            <p className="mt-2 text-[8px] sm:text-sm md:text-lg tracking-wide text-center">
               Supported by{' '}
               <a
                  target="_blank"
                  rel="noopener"
                  href="https://alces-flight.com"
                  className="inline-block align-middle"
               >
                  <Image
                     src="/alces-flight-horizontal.png"
                     width={394}
                     height={85}
                     alt="Alces Flight"
                     className="ml-1 inline-block h-auto w-20 align-middle sm:w-32 md:w-40"
                  />
               </a>
            </p>
         </div>

         <Image
            src="/parting_cloud_r.svg"
            width={288}
            height={150}
            alt=""
            className="h-auto w-[30%] max-w-72 shrink-0"
         />
      </footer>
   );
}
