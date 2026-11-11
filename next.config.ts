import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   basePath: '/openflightHPC_website_v2',
   experimental: {
      agentFeedback: true
   },
   images: {
      unoptimized: true
   },
   output: 'export',
   trailingSlash: true,
   turbopack: {
      rules: {
         '*.css': {
            as: '*.css',
            loaders: ['@tailwindcss/turbopack']
         }
      }
   }
};

export default nextConfig;
