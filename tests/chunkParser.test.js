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
