import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRawTextToChunks } from '../src/utils/chunkParser.js';

test('does not create empty cards for page markers or trailing delimiters', () => {
  const input = `=== หน้า 1 (คำนวณ, ภาพดิจิทัล) ===
### 1. CRISP-DS
• ขั้นตอนที่ 1 | ขั้นตอนที่ 2
---
### 2. สถิติบรรยาย
• ค่าเฉลี่ย | มัธยฐาน
---
=== หน้า 2 (หุ่นยนต์, โครงข่ายประสาท) ===
### 3. หุ่นยนต์
• นิยามหุ่นยนต์ | เซ็นเซอร์
---
`;

  const chunks = parseRawTextToChunks(input);

  assert.equal(chunks.length, 3);
  assert.equal(chunks[0].title, '1. CRISP-DS');
  assert.equal(chunks[0].targetPage, 1);
  assert.equal(chunks[1].title, '2. สถิติบรรยาย');
  assert.equal(chunks[1].targetPage, 1);
  assert.equal(chunks[2].title, '3. หุ่นยนต์');
  assert.equal(chunks[2].targetPage, 2);

  // Ensure all chunks have non-empty content
  chunks.forEach(c => {
    assert.ok(c.content.trim().length > 0, `Chunk ${c.title} should have non-empty content`);
    assert.ok(!c.title.includes('=== หน้า'), `Chunk title should not be a page header`);
  });
});

test('ignores chunks with only header or empty body', () => {
  const input = `### 1. หัวข้อที่ 1
เนื้อหาจริง
---
### 2. หัวข้อเปล่าที่ไม่มีเนื้อหา
---
### 3. หัวข้อที่ 3
เนื้อหาของกล่อง 3
`;

  const chunks = parseRawTextToChunks(input);

  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].title, '1. หัวข้อที่ 1');
  assert.equal(chunks[1].title, '3. หัวข้อที่ 3');
});

test('handles consecutive and trailing delimiters without producing empty cards', () => {
  const input = `
---
---
### 1. หัวข้อ
เนื้อหา
---
---
`;

  const chunks = parseRawTextToChunks(input);

  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].title, '1. หัวข้อ');
});

test('normalizeHighlightTags converts markdown ==text==, [hl=color], [hl], and <mark>', async () => {
  const { normalizeHighlightTags } = await import('../src/utils/promptGenerator.js');

  const input = '=== หน้า 1 ===\n• ==คำสำคัญที่ออกสอบ== | [hl=green]นิยาม[/hl] | [hl=pink]จุดระวัง[/hl] | [hl]เน้นย้ำ[/hl] | <mark>แท็ก mark</mark>';
  const normalized = normalizeHighlightTags(input);

  // Should NOT touch page headers
  assert.ok(normalized.includes('=== หน้า 1 ==='), 'Page header must not be corrupted');

  // Should convert markdown highlight ==text==
  assert.ok(normalized.includes('<mark style="background-color: #fef08a;'), 'Should convert ==text== to yellow mark');
  assert.ok(normalized.includes('คำสำคัญที่ออกสอบ'), 'Must retain content');

  // Should convert [hl=green] to green/lime hex
  assert.ok(normalized.includes('#bbf7d0'), 'Should convert green to #bbf7d0');

  // Should convert [hl=pink] to pink hex
  assert.ok(normalized.includes('#fbcfe8'), 'Should convert pink to #fbcfe8');

  // Should convert [hl] without color to yellow
  assert.ok(normalized.includes('เน้นย้ำ'), 'Must retain colorless hl');

  // Should style plain <mark>
  assert.ok(normalized.includes('แท็ก mark'), 'Must retain and style plain mark');
});

test('parseRawTextToChunks automatically converts ==text== and applies auto-highlights', () => {
  const input = `### 1. บทที่ 1
• ==จุดสำคัญระดับชาติ== | ศัพท์เฉพาะ "Viola-Jones"
---
### 2. บทที่ 2
• ⚠️ อาจารย์เน้นออกสอบ: การคำนวณระยะทาง Euclidean
`;

  const chunks = parseRawTextToChunks(input, { autoHighlight: true });

  assert.equal(chunks.length, 2);
  assert.ok(chunks[0].content.includes('<mark style="background-color: #fef08a;'), 'Chunk 0 must have highlight from ==');
  assert.ok(chunks[0].content.includes('Viola-Jones'), 'Chunk 0 must have auto-highlighted quote');
  assert.ok(chunks[1].content.includes('<mark style="background-color: #fbcfe8;'), 'Chunk 1 must have auto-highlighted exam warning');
});

test('parseRawTextToChunks sanitizes == in headers and supports multiline highlights', async () => {
  const input = `### 1. ==กระบวนการ CRISP-DS และการเริ่มต้น EDA==
• ==คำสำคัญที่ขึ้น
สองบรรทัด== | รายละเอียด
`;

  const chunks = parseRawTextToChunks(input);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].title, '1. กระบวนการ CRISP-DS และการเริ่มต้น EDA', 'Title must not contain ==');
  assert.ok(chunks[0].content.includes('<mark style="background-color: #fef08a;'), 'Must highlight multiline ==');
  assert.ok(chunks[0].content.includes('สองบรรทัด'), 'Must preserve content of multiline highlight');
});

