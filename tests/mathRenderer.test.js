import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cleanAndNormalizeFormula,
  renderLatexToHtml,
  normalizeMathDelimiters
} from '../src/utils/mathRenderer.js';

test('cleanAndNormalizeFormula handles labels with colon and common math symbols', () => {
  const input = 'สูตร Euclidean: d = √( (x₂ - x₁)² + (y₂ - y₁)² )';
  const result = cleanAndNormalizeFormula(input);

  assert.ok(result.startsWith('\\text{สูตร Euclidean: }'), 'Should wrap label in \\text');
  assert.ok(result.includes('^2'), 'Should convert superscript 2 to ^2');
  assert.ok(result.includes('\\sqrt'), 'Should convert √ to \\sqrt');
});

test('cleanAndNormalizeFormula converts unicode symbols to LaTeX commands', () => {
  const input = 'V = f · λ ⇐⇒ f = V/λ , T = 1/f , f ≥ 0';
  const result = cleanAndNormalizeFormula(input);

  assert.ok(result.includes('\\cdot'), 'Converts · to \\cdot');
  assert.ok(result.includes('\\lambda'), 'Converts λ to \\lambda');
  assert.ok(result.includes('\\iff'), 'Converts ⇐⇒ to \\iff');
  assert.ok(result.includes('\\ge'), 'Converts ≥ to \\ge');
});

test('renderLatexToHtml renders standard LaTeX into KaTeX HTML', () => {
  const latex = '\\sigma(z) = \\frac{1}{1 + e^{-z}}';
  const html = renderLatexToHtml(latex);

  assert.ok(html.includes('class="katex"'), 'Output must contain katex class');
  assert.ok(html.includes('mfrac') || html.includes('frac'), 'Output must render fraction');
});

test('renderLatexToHtml handles Thai characters and unicode safely without throwing', () => {
  const latex = '\\text{ความเร็ว} = \\frac{\\text{ระยะทาง}}{\\text{เวลา}}';
  const html = renderLatexToHtml(latex);

  assert.ok(html.includes('class="katex"'), 'KaTeX must render without throwing');
  assert.ok(html.includes('ความเร็ว'), 'Must contain the Thai text');
});

test('normalizeMathDelimiters converts $$, \\[, \\(, and $ math delimiters', () => {
  const input = 'บล็อก $$E = mc^2$$ และแทรก $f(x) = ax + b$ และ \\[A = \\pi r^2\\] และ \\(x > 0\\)';
  const normalized = normalizeMathDelimiters(input);

  assert.ok(normalized.includes('[formula]E = mc^2[/formula]'), '$$ should become [formula]');
  assert.ok(normalized.includes('[formula]A = \\pi r^2[/formula]'), '\\[ should become [formula]');
  assert.ok(normalized.includes('[formula-inline]f(x) = ax + b[/formula-inline]'), '$ should become [formula-inline]');
  assert.ok(normalized.includes('[formula-inline]x > 0[/formula-inline]'), '\\( should become [formula-inline]');
});

test('normalizeMathDelimiters splits multi-formula pipes but preserves conditional probability P(A|B)', () => {
  const multi = '[formula]Cycle Time = 1/f  |  CPI = Cycles/Instruction[/formula]';
  const normalizedMulti = normalizeMathDelimiters(multi);

  assert.equal(
    normalizedMulti,
    '[formula]Cycle Time = 1/f[/formula] | [formula]CPI = Cycles/Instruction[/formula]'
  );

  const cond = '[formula]P(A|B) = \\frac{P(B|A)P(A)}{P(B)}[/formula]';
  const normalizedCond = normalizeMathDelimiters(cond);
  assert.equal(normalizedCond, cond, 'Should not split P(A|B) without spaces around pipe');
});
