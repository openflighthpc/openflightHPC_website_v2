/**
 * Resolves an asset path written in project markdown to a site URL.
 * Absolute and remote paths are passed through untouched.
 */
export function resolveImagePath(src: string, projectName: string) {
   if (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('/')) {
      return src;
   }

   return `/projects/${encodeURIComponent(projectName)}/${src.replace(/^\.\//, '')}`;
}
