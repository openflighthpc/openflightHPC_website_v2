import {
   type CodeToHastOptions,
   createHighlighterCoreSync,
   type HighlighterCore
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import css from 'shiki/langs/css.mjs';
import diff from 'shiki/langs/diff.mjs';
import dockerfile from 'shiki/langs/dockerfile.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import python from 'shiki/langs/python.mjs';
import ruby from 'shiki/langs/ruby.mjs';
import shellscript from 'shiki/langs/shellscript.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import vesper from 'shiki/themes/vesper.mjs';

/**
 *
 */
const highlighter: HighlighterCore = createHighlighterCoreSync({
   engine: createJavaScriptRegexEngine({ forgiving: true }),
   langs: [bash, css, diff, dockerfile, javascript, json, python, ruby, shellscript, typescript],
   themes: [vesper]
});

/**
 * Highlights a code block to HTML with shiki, using the vesper theme.
 * Falls back to plain rendering for unknown languages.
 */
export function highlightCode(code: string, lang: string | undefined): string {
   try {
      const language = (lang ?? 'text') as CodeToHastOptions<string, string>['lang'];
      return highlighter.codeToHtml(code, {
         lang: language,
         theme: 'vesper'
      });
   } catch {
      return `<pre class="shiki"><code>${code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</code></pre>`;
   }
}
