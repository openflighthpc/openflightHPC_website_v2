import Image from 'next/image';


export default function Footer() {
   return (
      <footer className="z-80 flex mt-16  h-40 w-full items-end justify-between bg-black/80 text-white backdrop-blur">
         <Image
            src="/openflightHPC_website_v2/parting_cloud_l.svg"
            width={288}
            height={150}
            alt=""
            className="h-auto w-[30%] max-w-72 shrink-0"
         />

         <div className="flex min-w-0 translate-y-6 sm:translate-y-0 flex-1 flex-col items-center self-center px-2">
            <Image
               src="/openflightHPC_website_v2/header_logo.svg"
               width={288}
               height={150}
               alt="OpenFlight Labs"
               className="h-auto w-full max-w-[400px]"
            />
            <p className="mt-2 text-xs sm:text-sm md:text-lg tracking-wide text-center">
               Maintained by <a target="_blank" href="https://openflighthpc.github.io/docs.openflighthpc.org/latest/" className='text-green-400 transition hover:underline'>OpenFlightHPC</a> © {year}
            </p>
         </div>

         <Image
            src="/openflightHPC_website_v2/parting_cloud_r.svg"
            width={288}
            height={150}
            alt=""
            className="h-auto w-[30%] max-w-72 shrink-0"
         />
      </footer>
   );
}
