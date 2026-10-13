import assert from 'node:assert/strict';
import test from 'node:test';
import { generateSystemPrompt } from '../src/utils/promptGenerator.js';

test('generates one fixed two-page A4 cheat sheet format', () => {
  const prompt = generateSystemPrompt();

  assert.match(prompt, /=== หน้า 1 === และ === หน้า 2 ===/);
  assert.ok(prompt.includes('คั่นด้วย " | "'));
  assert.ok(prompt.includes('[formula]...[/formula]'));
  assert.match(prompt, /คั่นแต่ละกล่องด้วย ---/);
  assert.doesNotMatch(prompt, /1 หน้าเดียว|แยกบรรทัดปกติ|เลือกสไตล์/);
  // Ensure highlight instructions, example, and checklist are present
  assert.ok(prompt.includes('==ข้อความสำคัญ=='), 'Prompt must contain markdown highlight syntax');
  assert.ok(prompt.includes('【ตัวอย่างผลลัพธ์ที่ถูกต้อง'), 'Prompt must include few-shot demonstration');
  assert.ok(prompt.includes('【เช็กลิสต์สำคัญก่อนเริ่มสร้างคำตอบ】'), 'Prompt must include mandatory checklist');
});

test('uses the selected card delimiter and falls back when it is blank', () => {
  assert.match(generateSystemPrompt({ delimiter: '+++ ' }), /คั่นแต่ละกล่องด้วย \+\+\+/);
  assert.match(generateSystemPrompt({ delimiter: '   ' }), /คั่นแต่ละกล่องด้วย ---/);
});

