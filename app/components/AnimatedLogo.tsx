import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const logoMarkup = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
   .replace(/^[\s\S]*?(?=<svg\b)/, '')
   .replace(/<!\[CDATA\[|\]\]>/g, '');

export default function AnimatedLogo() {
   return (
      <div
         className="animated-logo"
         role="img"
         aria-label="OpenFlight Labs logo"
         dangerouslySetInnerHTML={{ __html: logoMarkup }}
      />
   );
}
