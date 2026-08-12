import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Pre-processes plain text and broken LaTeX into clean, valid KaTeX formulas
 */
function autoFormatPlainMath(inputStr) {
  if (!inputStr || typeof inputStr !== 'string') return '';

  let str = inputStr;

  // 1. Fix double backslashes (e.g. \\sqrt -> \sqrt, \\frac -> \frac, \\ge -> \ge)
  str = str.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // 2. Convert plain text sqrt(...) or sqrt{...} -> \sqrt{...}
  str = str.replace(/sqrt\(([^)]+)\)/gi, '\\sqrt{$1}');
  str = str.replace(/sqrt\{([^}]+)\}/gi, '\\sqrt{$1}');

  // 3. Convert f^(-1)(x) or f^-1(x) -> f^{-1}(x)
  str = str.replace(/f\^?\(?-1\)?\(([^)]+)\)/g, 'f^{-1}($1)');

  // 4. Handle inequality >= and <= ONLY for math variables/expressions (avoiding preceding text)
  // e.g. x + y <= 4 or x >= -3/2
  str = str.replace(/([a-zA-Z0-9_\(\)]+(?:\s*[\+\-\*\/]\s*[a-zA-Z0-9_\(\)]+)*)\s*>=\s*(-?\d+\/\d+|-?\d+|[a-zA-Z0-9]+)/g, ' $1 \\ge $2 ');
  str = str.replace(/([a-zA-Z0-9_\(\)]+(?:\s*[\+\-\*\/]\s*[a-zA-Z0-9_\(\)]+)*)\s*<=\s*(-?\d+\/\d+|-?\d+|[a-zA-Z0-9]+)/g, ' $1 \\le $2 ');

  // 5. Unbalanced $ cleanup
  const dollarCount = (str.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    str = str.replace(/\$/g, '');
  }

  // 6. Auto-wrap standalone LaTeX commands (\sqrt{...}, \frac{...}{...}, \ge, \le, f^{-1}) if not wrapped in $
  str = str.replace(/([^$]|^)(\\sqrt\{[^}]+\})([^$]|$)/g, '$1 $2 $3');
  str = str.replace(/([^$]|^)(\\frac\{[^}]+\}\{[^}]+\})([^$]|$)/g, '$1 $2 $3');
  str = str.replace(/([^$]|^)(f\^\{-1\}\([^)]+\))([^$]|$)/g, '$1 $2 $3');
  
  // Auto-wrap simple variable inequality like x \ge 0 or x \le 4
  str = str.replace(/([^$]|^)([a-zA-Z0-9_\(\)\s]+\s*\\ge\s*[-\d\/a-zA-Z{}]+)([^$]|$)/g, '$1 $2 $3');
  str = str.replace(/([^$]|^)([a-zA-Z0-9_\(\)\s]+\s*\\le\s*[-\d\/a-zA-Z{}]+)([^$]|$)/g, '$1 $2 $3');

  return str;
}

export default function MathText({ text = '', className = '' }) {
  if (!text) return null;

  const formattedText = autoFormatPlainMath(text);

  // Split string into text and math segments ($...$ or $$...$$)
  const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
  const parts = formattedText.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const mathContent = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(mathContent, {
              displayMode: true,
              throwOnError: false
            });
            return (
              <span
                key={idx}
                className="my-2 block text-center overflow-x-auto py-1"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={idx}>{part}</span>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const mathContent = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(mathContent, {
              displayMode: false,
              throwOnError: false
            });
            return (
              <span
                key={idx}
                className="inline-block mx-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={idx}>{part}</span>;
          }
        }

        // Check if plain part contains un-wrapped LaTeX commands
        if (part.includes('\\sqrt') || part.includes('\\frac') || part.includes('f^{-1}')) {
          try {
            const html = katex.renderToString(part, {
              displayMode: false,
              throwOnError: false
            });
            return (
              <span
                key={idx}
                className="inline-block mx-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={idx}>{part}</span>;
          }
        }

        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}
