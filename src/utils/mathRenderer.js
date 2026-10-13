import katex from 'katex';

/**
 * Normalizes formula string by handling text labels, common unicode math symbols,
 * and preparing it for KaTeX rendering.
 */
export function cleanAndNormalizeFormula(str) {
  if (!str) return '';
  let res = str.trim();

  // If starts with label followed by colon: 'สูตร Euclidean: d = ...' -> '\text{สูตร Euclidean: } d = ...'
  const colonMatch = res.match(/^([^\n:={}\\]+:\s*)(.+)$/);
  if (colonMatch && !colonMatch[1].startsWith('\\text{')) {
    const label = colonMatch[1];
    const math = colonMatch[2];
    res = `\\text{${label.trim()} } ${math}`;
  }

  // Common unicode Greek letters
  res = res.replace(/α/g, '\\alpha ')
           .replace(/β/g, '\\beta ')
           .replace(/γ/g, '\\gamma ')
           .replace(/λ/g, '\\lambda ')
           .replace(/μ/g, '\\mu ')
           .replace(/π/g, '\\pi ')
           .replace(/θ/g, '\\theta ')
           .replace(/Δ/g, '\\Delta ')
           .replace(/Σ/g, '\\Sigma ');

  // Mathematical operators & arrows
  res = res.replace(/⇐⇒/g, ' \\iff ')
           .replace(/⇒/g, ' \\implies ')
           .replace(/→/g, ' \\to ')
           .replace(/≈/g, ' \\approx ')
           .replace(/×/g, ' \\times ')
           .replace(/÷/g, ' \\div ')
           .replace(/·/g, ' \\cdot ')
           .replace(/≥/g, ' \\ge ')
           .replace(/≤/g, ' \\le ')
           .replace(/≠/g, ' \\ne ');

  // Common unicode square roots and powers if written without LaTeX
  // Handle balanced parentheses for √( ... )
  let sqrtIdx = res.indexOf('√(');
  while (sqrtIdx !== -1) {
    let depth = 0;
    let endIdx = -1;
    for (let i = sqrtIdx + 1; i < res.length; i++) {
      if (res[i] === '(') depth++;
      else if (res[i] === ')') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx !== -1) {
      const inside = res.slice(sqrtIdx + 2, endIdx);
      res = res.slice(0, sqrtIdx) + `\\sqrt{${inside.trim()}}` + res.slice(endIdx + 1);
      sqrtIdx = res.indexOf('√(', sqrtIdx + 6);
    } else {
      break;
    }
  }

  res = res.replace(/√([0-9a-zA-Z]+)/g, (_m, g1) => `\\sqrt{${g1}}`)
           .replace(/²/g, '^2')
           .replace(/³/g, '^3')
           .replace(/⁻¹/g, '^{-1}');

  return res.trim();
}

/**
 * Renders a LaTeX string to HTML using KaTeX.
 * Safe fallback on errors with throwOnError: false.
 */
export function renderLatexToHtml(latex, { displayMode = false } = {}) {
  if (!latex) return '';
  const cleanLatex = cleanAndNormalizeFormula(latex);

  try {
    return katex.renderToString(cleanLatex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      output: 'htmlAndMathml'
    });
  } catch {
    // Graceful fallback to readable monospace badge
    return `<span class="katex-fallback font-mono">${escapeHtml(latex)}</span>`;
  }
}

/**
 * Pre-processes text to standardize various math delimiter formats:
 * - $$...$$ -> [formula]...[/formula]
 * - \[...\] -> [formula]...[/formula]
 * - \(...\) -> [formula-inline]...[/formula-inline]
 * - $...$ -> [formula-inline]...[/formula-inline]
 * - Splits multi-formula pipe groups: [formula]A | B[/formula] -> [formula]A[/formula] | [formula]B[/formula]
 */
export function normalizeMathDelimiters(content) {
  if (!content) return '';

  let result = content;

  // 1. Block LaTeX: \[ ... \] and $$ ... $$ -> [formula]...[/formula]
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, ' [formula]$1[/formula] ');
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, ' [formula]$1[/formula] ');

  // 2. Inline LaTeX: \( ... \) -> [formula-inline]...[/formula-inline]
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, ' [formula-inline]$1[/formula-inline] ');

  // 3. Inline LaTeX: $...$ (requires non-whitespace inside and non-word outside)
  result = result.replace(/(?<![\w$\\])\$([^\s$\n](?:[^$\n]*?[^\s$\n])?)\$(?![\w$])/g, ' [formula-inline]$1[/formula-inline] ');

  // 4. Split multiple formulas within [formula] that have spaces around pipe
  // e.g. [formula]A = 1  |  B = 2[/formula] -> [formula]A = 1[/formula] | [formula]B = 2[/formula]
  result = result.replace(/\[formula\]([\s\S]*?)\[\/formula\]/g, (_m, inner) => {
    if (/\s{1,}\|\s{1,}/.test(inner)) {
      const parts = inner.split(/\s{1,}\|\s{1,}/);
      return parts.map(p => `[formula]${p.trim()}[/formula]`).join(' | ');
    }
    return `[formula]${inner}[/formula]`;
  });

  return result;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
