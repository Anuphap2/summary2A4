/**
 * AI System Prompt Generator & Text Compaction Utilities
 * Designed to maximize space efficiency on standard A4 cheat sheets
 * by condensing sub-points inline using pipe (' | ') dividers and color highlights.
 */

export const HIGHLIGHT_COLORS = [
  { id: 'yellow', name: 'เหลือง (จุดสำคัญ/ออกสอบ)', hex: '#fef08a' },
  { id: 'lime', name: 'เขียว (นิยาม/ข้อดี)', hex: '#bbf7d0' },
  { id: 'pink', name: 'ชมพู (ความเร็ว/จุดระวัง)', hex: '#fbcfe8' },
  { id: 'sky', name: 'ฟ้า (ประเภท/ตัวอย่าง)', hex: '#bae6fd' },
  { id: 'orange', name: 'ส้ม (คำนวณ/สูตร)', hex: '#fed7aa' },
  { id: 'purple', name: 'ม่วง (หลักการ/ทฤษฎี)', hex: '#e9d5ff' }
];

export const HIGHLIGHT_COLOR_MAP = {
  yellow: '#fef08a',
  lime: '#bbf7d0',
  green: '#bbf7d0',
  pink: '#fbcfe8',
  sky: '#bae6fd',
  blue: '#bae6fd',
  orange: '#fed7aa',
  purple: '#e9d5ff',
  violet: '#e9d5ff'
};

/**
 * Generate the single A4 cheat sheet prompt used by the app.
 */
export const generateSystemPrompt = ({ delimiter = '---' } = {}) => {
  const delim = delimiter.trim() || '---';

  return `คุณคือผู้ช่วยสรุปเนื้อหาและสร้าง Cheat Sheet สรุปสอบระดับมืออาชีพ สำหรับพิมพ์ลงกระดาษ A4

【เป้าหมาย】
นำเนื้อหาที่ผู้ใช้ให้มาสรุปเป็นชีทสองหน้า A4 แบบเดียวกับหน้า A4 ในแอป: เนื้อหากระชับ ต่อเนื่อง ใช้พื้นที่คุ้ม และอ่านรู้เรื่อง

【รูปแบบเดียวที่ต้องใช้】

1. แบ่งผลลัพธ์เป็น 2 หน้า A4 โดยเริ่มด้วยบรรทัด === หน้า 1 === และ === หน้า 2 === ตามลำดับ เนื้อหาที่อยู่ระหว่างหัวหน้าเป็นของหน้านั้น
2. แบ่งเนื้อหาเป็นกล่องโดยคั่นแต่ละกล่องด้วย ${delim}
3. บรรทัดแรกของแต่ละกล่องให้เป็นหัวข้อรูปแบบ ### [ลำดับ]. [ชื่อหัวข้อ]
4. เขียนเป็นภาษาไทย กระชับแบบชีทสรุป ใช้ศัพท์อังกฤษตามต้นฉบับ และรักษาข้อเท็จจริง ตัวเลข และความหมายให้ครบ ห้ามแต่งข้อมูลเพิ่ม
5. จัดประเด็นที่เกี่ยวข้องให้อยู่บรรทัดเดียวกัน คั่นด้วย " | " เพื่อลดช่องว่างและความสูงของหน้า ใช้บรรทัดใหม่เฉพาะเมื่อขึ้นประเด็นหรือสูตรชุดใหม่
6. เน้นชื่อศัพท์และคำสำคัญด้วย <b>คำสำคัญ:</b> ใช้ bullet • กับบรรทัดเนื้อหา
7. ไฮไลท์เฉพาะจุดที่ควรจำหรือเปรียบเทียบด้วยแท็กสีที่แอปรองรับ:
   <mark style="background-color: #fef08a;">สำคัญ/ออกสอบ</mark>, <mark style="background-color: #bbf7d0;">นิยาม/ข้อดี</mark>, <mark style="background-color: #fbcfe8;">ข้อควรระวัง/ค่าที่เด่น</mark>, <mark style="background-color: #bae6fd;">ประเภท/ตัวอย่าง</mark>, <mark style="background-color: #fed7aa;">สูตร/การคำนวณ</mark>, <mark style="background-color: #e9d5ff;">หลักการ</mark>
8. ครอบสูตร สมการ และนิพจน์คณิตศาสตร์ด้วย [formula]...[/formula]
9. จัดจำนวนกล่องตามเนื้อหาจริง ให้แต่ละหน้ามีเนื้อหาพอดีกับ A4 ไม่กำหนดจำนวนกล่องตายตัว และอย่าตัดสาระสำคัญเพียงเพื่อบีบให้สั้น
10. ห้ามใส่คำเกริ่น คำทักทาย คำปิดท้าย หรือ code fence ให้เริ่มด้วย === หน้า 1 === ทันที

เนื้อหาที่ต้องการให้สรุป:
[วางเนื้อหา เลกเชอร์ หรือสไลด์ตรงนี้]`;
};

/**
 * Automatically compacts loose multi-line bullet lists into inline points
 * separated by ' | ' and strips redundant blank lines, saving massive paper space.
 */
export const compactContentWithPipeAndColor = (text) => {
  if (!text) return '';

  const lines = text.split('\n');
  const processedLines = [];
  let pendingSubItems = [];

  const flushPendingItems = () => {
    if (pendingSubItems.length === 0) return;
    if (pendingSubItems.length === 1) {
      processedLines.push(pendingSubItems[0]);
    } else {
      // Group them with ' | '
      const firstItem = pendingSubItems[0];
      const hasBullet = /^[-•*]\s+/.test(firstItem);
      const cleanItems = pendingSubItems.map(item => {
        let cleaned = item.replace(/^[-•*]\s+/, '').trim();
        // If it starts with keyword: e.g. "ALU: ..." without <b>, wrap it in <b>
        if (!cleaned.startsWith('<b>') && !cleaned.startsWith('<mark')) {
          cleaned = cleaned.replace(/^([A-Za-z0-9ก-๙\s_-]{2,30}):\s*/, '<b>$1:</b> ');
        }
        return cleaned;
      });

      const joined = (hasBullet ? '• ' : '') + cleanItems.join(' | ');
      processedLines.push(joined);
    }
    pendingSubItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line is empty or header or formula or section
    const isFormula = trimmed.startsWith('[formula]') || trimmed.endsWith('[/formula]');
    const isHeader = /^#{1,4}\s+/.test(trimmed) || /^===/.test(trimmed) || /^---/.test(trimmed);
    const isBulletItem = /^[-•*]\s+/.test(trimmed) || /^[0-9]+[.)]\s+/.test(trimmed);

    if (!trimmed) {
      flushPendingItems();
      // Skip redundant empty lines to avoid wasting page space
      continue;
    }

    if (isFormula || isHeader) {
      flushPendingItems();
      processedLines.push(line);
      continue;
    }

    if (isBulletItem) {
      // Sub-bullet item to be compacted
      pendingSubItems.push(trimmed);
    } else {
      flushPendingItems();
      processedLines.push(line);
    }
  }

  flushPendingItems();
  return processedLines.join('\n');
};

/**
 * Sample ultra-compact notes demonstrating ' | ' and color highlights
 */
export const getSampleUltraCompactNotes = (delim = '---') => {
  return `=== หน้า 1 ===
### 1. สถาปัตยกรรมคอมพิวเตอร์ & CPU
• <b>ALU:</b> <mark style="background-color: #fef08a;">คำนวณคณิตศาสตร์และตรรกะ</mark> | <b>CU:</b> ถอดรหัสคำสั่งและคุมสัญญาณ | <b>Register:</b> <mark style="background-color: #fbcfe8;">ความเร็วสูงสุดใน CPU</mark>
• <b>วงรอบการทำงาน:</b> Fetch → Decode → Execute | <b>System Bus:</b> Data, Address, Control
• [formula]Cycle Time = 1 / Frequency  |  CPI = Cycles / Instruction[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Cache L1-L3:</b> <mark style="background-color: #fef08a;">เร็วสุด ความจุจำกัด</mark> | <b>RAM:</b> หน่วยความจำหลัก Volatile ดับแล้วหาย | <b>SSD/HDD:</b> บันทึกข้อมูลถาวร
• <b>Virtual Memory:</b> ใช้พื้นที่ดิสก์จำลองเป็น RAM | <b>Paging:</b> แบ่งบล็อกขนาดเท่ากัน
• [formula]Capacity = 2^AddressLines × DataBits[/formula]
${delim}
### 3. บิต ไบต์ และการแปลงหน่วยข้อมูล
• <b>Bit:</b> 0 หรือ 1 เล็กสุด | <b>Byte:</b> 8 Bits (256 สถานะ) | <b>สเต็ปแปลง:</b> 1 KB = 1024 B | 1 MB = 1024 KB
• [formula]Bits ÷ 8 = Bytes → ÷ 1024 = KB → ÷ 1024 = MB[/formula]
${delim}
### 4. พีชคณิตบูลีน & Logic Gates
• <b>AND Gate:</b> เป็น 1 เมื่อทุกอินพุตเป็น 1 | <b>OR Gate:</b> เป็น 1 เมื่อมีอินพุตใดเป็น 1
• <b>De Morgan's Laws:</b> [formula]~(A ∧ B) = ~A ∨ ~B  |  ~(A ∨ B) = ~A ∧ ~B[/formula]

=== หน้า 2 ===
### 5. อัลกอริทึม & Time Complexity (Big-O)
• <b>O(1):</b> คงที่เข้าถึง Index | <b>O(log n):</b> Binary Search (<mark style="background-color: #bbf7d0;">ต้องเรียงข้อมูลก่อน</mark>) | <b>O(n):</b> Linear Search
• <b>O(n log n):</b> Merge/Quick Sort (เฉลี่ย) | <b>O(n²):</b> Bubble Sort
${delim}
### 6. โครงสร้างข้อมูลพื้นฐาน (Data Structures)
• <b>Stack (LIFO):</b> เข้าหลังออกก่อน (ปุ่ม Undo) | <b>Queue (FIFO):</b> เข้าก่อนออกก่อน (คิวพิมพ์งาน)
• <b>Linked List:</b> ยืดหยุ่นแทรก/ลบเร็ว | <b>Hash Table:</b> ค้นหาเฉลี่ย O(1) ด้วยคีย์
${delim}
### 7. พื้นฐานระบบเครือข่าย & OSI Model
• <b>OSI 7 Layers:</b> 1.Physical → 2.Data Link → 3.Network → 4.Transport → 5.Session → 6.Presentation → 7.Application
• <mark style="background-color: #bae6fd;">TCP:</mark> เชื่อถือได้ ตรวจสอบสูญหาย | <mark style="background-color: #fed7aa;">UDP:</mark> รวดเร็ว ไม่เช็คสูญหาย
${delim}
### 8. ความปลอดภัยคอมพิวเตอร์ (CIA Triad)
• <b>Confidentiality:</b> รักษาความลับ เข้ารหัส | <b>Integrity:</b> ตรวจสอบความถูกต้องด้วย Hash
• <b>Availability:</b> พร้อมใช้งานตลอดเวลา มีระบบสำรองข้อมูล`;
};
