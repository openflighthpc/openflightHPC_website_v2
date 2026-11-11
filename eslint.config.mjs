import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import perfectionist from 'eslint-plugin-perfectionist';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig(
   {
      plugins: {
         perfectionist,
         'simple-import-sort': simpleImportSort,
         'unused-imports': unusedImports
      },
      rules: {
         'perfectionist/sort-objects': [
            'error',
            {
               ignoreCase: true,
               order: 'asc',
               type: 'natural'
            }
         ],
         'simple-import-sort/exports': 'error',

         'simple-import-sort/imports': 'error',

         'unused-imports/no-unused-imports': 'error',
         'unused-imports/no-unused-vars': [
            'warn',
            {
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_'
            }
         ]
      }
   },
   [...nextVitals, ...nextTs, globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])]
);

export default eslintConfig;
