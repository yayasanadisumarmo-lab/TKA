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

  // 2. Convert any plain text sqrt(...) or sqrt{...} or sqrt 2x+3 -> \sqrt{...}
  str = str.replace(/\\?sqrt\(([^)]+)\)/gi, '\\sqrt{$1}');
  str = str.replace(/\\?sqrt\{([^}]+)\}/gi, '\\sqrt{$1}');
  // Match sqrt followed by expression like sqrt2x + 3 or sqrt 2x + 3
  str = str.replace(/\\?sqrt\s*([0-9a-zA-Z]+(?:\s*[\+\-\*\/]\s*[0-9a-zA-Z]+)*)/gi, '\\sqrt{$1}');

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

  // Array to store rendered KaTeX HTML strings
  const mathPlaceholders = [];

  // Match $$...$$ and $...$
  const processedText = formattedText.replace(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g, (match) => {
    const isDisplay = match.startsWith('$$');
    const mathContent = isDisplay ? match.slice(2, -2).trim() : match.slice(1, -1).trim();

    try {
      const katexHtml = katex.renderToString(mathContent, {
        displayMode: isDisplay,
        throwOnError: false
      });
      const placeholder = `___MATH_PH_${mathPlaceholders.length}___`;
      mathPlaceholders.push(
        `<span class="${isDisplay ? 'my-2 block text-center overflow-x-auto py-1' : 'inline-block mx-0.5'}">${katexHtml}</span>`
      );
      return placeholder;
    } catch (e) {
      return match;
    }
  });

  // Convert newlines to <br /> for plain text sections
  let htmlResult = processedText.replace(/\n/g, '<br />');

  // Restore KaTeX rendered math HTML
  mathPlaceholders.forEach((katexMarkup, idx) => {
    htmlResult = htmlResult.replace(`___MATH_PH_${idx}___`, katexMarkup);
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlResult }}
    />
  );
}
