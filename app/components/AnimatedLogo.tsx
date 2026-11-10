import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default function AnimatedLogo() {
   return (
      <div
         className="animated-logo"
         aria-label="OpenFlight Labs logo"
         role="img"
         dangerouslySetInnerHTML={{
            __html: readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
               .replace(/^[\s\S]*?(?=<svg\b)/, '')
               .replace(/<!\[CDATA\[|\]\]>/g, '')
         }}
      />
   );
}
