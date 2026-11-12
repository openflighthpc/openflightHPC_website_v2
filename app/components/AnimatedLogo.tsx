import Image from 'next/image';

export default function AnimatedLogo() {
   return (
      <Image
         className="animated-logo"
         src="/openflightHPC_website_v2/logo.svg"
         alt="OpenFlight Labs logo"
         width={0}
         height={0}
      />
   );
}
