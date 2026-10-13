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
 * Generate a specialized AI System Prompt that commands LLMs (ChatGPT, Claude, Gemini)
 * to output cheat sheet cards formatted tightly with ' | ' separators and color highlights.
 */
export const generateSystemPrompt = ({
  pages = '2-pages',
  boxes = '4',
  style = 'exam',
  density = 'ultra-compact',
  delimiter = '---'
} = {}) => {
  const isTwoPages = pages === '2-pages';
  const delim = delimiter.trim() || '---';
  const isUltraDense = density === 'ultra-compact';

  const boxesDesc = boxes === 'auto' 
    ? 'ประมาณ 4-6 กล่องต่อหน้า' 
    : `${boxes} กล่องต่อหน้า`;
  const totalBoxesDesc = isTwoPages 
    ? (boxes === 'auto' ? '8-12 กล่อง' : `${Number(boxes) * 2} กล่อง`)
    : (boxes === 'auto' ? '4-6 กล่อง' : `${boxes} กล่อง`);

  const pageInstruction = isTwoPages
    ? `- สรุปสำหรับพิมพ์ลงกระดาษ A4 สองหน้า (หน้า 1 ด้านหน้า และ หน้า 2 ด้านหลัง) รวมทั้งหมดประมาณ ${totalBoxesDesc}
- บรรทัดแรกสุดของหน้า 1 ให้ขึ้นต้นด้วย: === หน้า 1 ===
- เมื่อจบเนื้อหาหน้า 1 และจะเริ่มหน้า 2 ให้คั่นด้วยบรรทัด: === หน้า 2 ===
- แต่ละหน้าควรมี ${boxesDesc} เพื่อให้จัดวางลงหน้ากระดาษ A4 ได้พอดี ไม่ล้นหน้า`
    : `- สรุปสำหรับพิมพ์ลงกระดาษ A4 หน้าเดียว (1 หน้า) จำนวนทั้งหมดประมาณ ${totalBoxesDesc}
- บรรทัดแรกสุด ให้ขึ้นต้นด้วย: === หน้า 1 ===
- ควรมี ${boxesDesc} เพื่อให้จัดวางลง 1 หน้า A4 ได้พอดี ไม่ล้นหน้า`;

  const densityInstruction = isUltraDense
    ? `🔥 【กฎเหล็กสำคัญที่สุด: อัดแน่นประหยัดพื้นที่กระดาษ A4 (ห้ามล้นหน้าเด็ดขาด)】:
1. ⚠️ ห้ามขึ้นบรรทัดใหม่พร่ำเพรื่อ หรือแยกหัวข้อย่อยเป็นบรรทัดใหม่ทีละบรรทัดเด็ดขาด เพราะจะเปลืองความสูงของหน้ากระดาษ A4 ทำให้ล้นหน้า
2. เนื้อหาและประเด็นย่อยต้องติดกันเป็นแนวนอน (Inline Flow) โดยใช้เครื่องหมาย " | " คั่นระหว่างประเด็นย่อย
3. ใช้การแบ่งด้วย "สีไฮไลท์" สลับกัน เพื่อให้ผู้อ่านแยกประเด็นย่อยได้ชัดเจนสะดุดตาทันที แม้เนื้อหาจะเขียนติดกันในบรรทัดเดียวกัน
4. โครงสร้างภายในกล่อง:
   - นำหัวข้อย่อย 2-4 เรื่องที่เกี่ยวข้องกันมารวมใน 1 บรรทัด โดยคั่นด้วย " | "
   - ตัวอย่างที่ผิด ❌ (เปลืองพื้นที่กระดาษ เว้นบรรทัดเยอะ):
     • ALU: ทำหน้าที่คำนวณคณิตศาสตร์
     • CU: ควบคุมคำสั่งและจังหวะ
     • Register: หน่วยความจำความเร็วสูงสุด
   - ตัวอย่างที่ถูกต้อง ✅ (อัดแน่น ประหยัดพื้นที่ A4 คั่นด้วย | และสี):
     • <b>ALU:</b> <mark style="background-color: #fef08a;">คำนวณคณิต/ตรรกะ</mark> | <b>CU:</b> ควบคุมคำสั่งและสัญญาณนาฬิกา | <b>Register:</b> <mark style="background-color: #fbcfe8;">ความเร็วสูงสุดใน CPU</mark>`
    : `- สรุปโดยใช้ Bullet Point ทีละบรรทัด กระชับ ชัดเจน`;

  const styleInstruction = style === 'exam'
    ? `- สไตล์การสรุป: สรุปเข้มข้นสไตล์ Cheat Sheet สรุปสอบ เน้นคีย์เวิร์ด สูตร นิยาม และจุดที่มักออกสอบ
- ตัดน้ำทิ้งทั้งหมด ให้เหลือเฉพาะแก่นความรู้และข้อสอบจริง`
    : `- สไตล์การสรุป: สรุปเป็นระเบียบ เข้าใจง่าย อธิบายขั้นตอนและหลักการสำคัญอย่างครบถ้วน พร้อมตัวอย่างประกอบสั้นๆ`;

  const colorGuide = `- ไฮไลท์ข้อความสำคัญ (Highlighter) และการใช้สีแบ่งประเด็น:
  ให้ครอบด้วยแท็ก: <mark style="background-color: [รหัสสี];">ข้อความ</mark>
  หรือเขียนแบบย่อ: [hl=yellow]ข้อความ[/hl], [hl=lime]ข้อความ[/hl], [hl=pink]ข้อความ[/hl], [hl=sky]ข้อความ[/hl], [hl=orange]ข้อความ[/hl], [hl=purple]ข้อความ[/hl]
  (เฉดสีที่ระบบรองรับ: เหลือง #fef08a, เขียว #bbf7d0, ชมพู #fbcfe8, ฟ้า #bae6fd, ส้ม #fed7aa, ม่วง #e9d5ff)`;

  const exampleOutput = isUltraDense
    ? `${isTwoPages ? `=== หน้า 1 ===\n` : `=== หน้า 1 ===\n`}### 1. สถาปัตยกรรมคอมพิวเตอร์ & CPU
• <b>ALU:</b> <mark style="background-color: #fef08a;">คำนวณคณิตศาสตร์และตรรกะ</mark> | <b>CU:</b> ถอดรหัสคำสั่งและสั่งการ | <b>Register:</b> <mark style="background-color: #fbcfe8;">ความเร็วสูงสุดใน CPU</mark>
• <b>วงรอบการทำงาน:</b> Fetch → Decode → Execute | <b>System Bus:</b> Data Bus, Address Bus, Control Bus
• [formula]Cycle Time = 1 / Frequency  |  CPI = Cycles / Instruction[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Cache L1-L3:</b> <mark style="background-color: #fef08a;">ความเร็วสูงสุด ความจุจำกัด</mark> | <b>RAM:</b> หน่วยความจำหลัก Volatile ดับแล้วหาย | <b>SSD/HDD:</b> ข้อมูลถาวร
• <b>Virtual Memory:</b> ใช้ฮาร์ดดิสก์จำลองเป็น RAM | <b>Paging:</b> แบ่งบล็อกขนาดเท่ากัน
• [formula]Capacity = 2^AddressLines × DataBits[/formula]
${isTwoPages ? `\n=== หน้า 2 ===\n### 3. อัลกอริทึมและการเรียงลำดับ (Sorting)
• <b>Bubble Sort:</b> [formula]O(n²)[/formula] สลับคู่ติดกัน | <b>Quick Sort:</b> [formula]O(n log n)[/formula] เฉลี่ย <mark style="background-color: #fed7aa;">มี Pivot</mark>
• <b>Binary Search:</b> [formula]O(log n)[/formula] <mark style="background-color: #bbf7d0;">ข้อมูลต้องเรียงลำดับก่อนเสมอ</mark> | <b>Linear Search:</b> [formula]O(n)[/formula]
${delim}
### 4. ความปลอดภัยข้อมูล & เครือข่าย
• <mark style="background-color: #bae6fd;">Confidentiality:</mark> เข้ารหัสข้อมูล ป้องกันดักฟัง | <mark style="background-color: #e9d5ff;">Integrity:</mark> ตรวจสอบความถูกต้องด้วย Hashing
• <b>Availability:</b> พร้อมใช้งานตลอดเวลา | <b>TCP:</b> เชื่อถือได้ เช็คข้อมูล | <b>UDP:</b> เร็ว ไม่เช็คสูญหาย` : ''}`
    : `${isTwoPages ? `=== หน้า 1 ===\n` : `=== หน้า 1 ===\n`}### 1. สถาปัตยกรรมคอมพิวเตอร์ & CPU
• <b>ALU (Arithmetic Logic Unit):</b> ประมวลผล<mark style="background-color: #fef08a;">คำนวณคณิตศาสตร์และตรรกะ</mark>
• <b>Control Unit (CU):</b> ถอดรหัสคำสั่งและสั่งการจังหวะการทำงาน
• <b>Register:</b> หน่วยความจำ<mark style="background-color: #fbcfe8;">ความเร็วสูงสุด</mark>ในตัว CPU
• [formula]Cycle Time = 1 / Frequency  |  CPI = Cycles / Instruction[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Cache L1-L3:</b> ความเร็วสูงสุด ความจุจำกัด ต้นทุนสูง
• <b>RAM:</b> หน่วยความจำหลัก ชั่วคราว (Volatile)
• <b>Secondary Storage:</b> SSD/HDD บันทึกข้อมูลถาวร
• [formula]Capacity = 2^AddressLines × DataBits[/formula]`;

  return `คุณคือผู้ช่วยสรุปเนื้อหาและสร้าง Cheat Sheet สรุปสอบระดับมืออาชีพ สำหรับพิมพ์ลงกระดาษ A4

【เป้าหมาย】
นำเนื้อหา/เอกสาร/สไลด์ที่ผู้ใช้ระบุ มาสรุปและจัดเป็น "กล่องสรุป (Cards)" เพื่อนำไปวางในโปรแกรมสร้างใบสรุป A4
${isUltraDense ? '🔥 หัวใจสำคัญ: ต้องประหยัดพื้นที่หน้ากระดาษ A4 สูงสุด อย่าให้เนื้อหายาวจนล้นหน้า โดยใช้วิธีจัดเนื้อหาติดกันในแนวนอน คั่นด้วยเครื่องหมาย " | " หรือสีไฮไลท์' : ''}

【กฎรูปแบบโครงสร้าง (Format Rules) ที่ต้องปฏิบัติตามอย่างเคร่งครัด】

1. การจัดหน้ากระดาษ:
${pageInstruction}

2. การแบ่งกล่องสรุป (สำคัญ):
- ให้คั่นระหว่างแต่ละกล่องสรุปด้วยเครื่องหมาย: ${delim}
- บรรทัดแรกสุดของแต่ละกล่อง ให้ตั้งชื่อหัวข้อโดยขึ้นต้นด้วย "### [ลำดับ]. [ชื่อหัวข้อสั้นกระชับ]" เช่น "### 1. โครงสร้างข้อมูล Stack & Queue"
- (ทางเลือก) สามารถระบุแท็กหมวดหมู่ในบรรทัดถัดมาได้ เช่น "[แท็ก: โครงสร้างข้อมูล]"

3. การจัดฟอร์แมตเนื้อหาภายในกล่อง:
${densityInstruction}
${styleInstruction}
- เน้นคำสำคัญ/ศัพท์เฉพาะ ด้วยแท็กตัวหนา: <b>คำสำคัญ:</b> คำอธิบาย
${colorGuide}
- หากมีสูตรคำนวณ สมการ หรือคณิตศาสตร์ ให้ครอบด้วยแท็ก: [formula]สมการที่นี่[/formula]
  (หากมีสูตรสั้นๆ หลายสูตร สามารถรวมในกล่องเดียวกันโดยคั่นด้วย " | " เช่น [formula]F = 1/T  |  V = F × λ[/formula])
- ความยาวเนื้อหาต่อกล่อง: ประมาณ 200 - 450 ตัวอักษร ให้กระชับพอดีกับการแสดงผลลงแผ่น A4

4. ข้อห้าม:
- ห้ามพิมพ์คำทักทาย เกริ่นนำ หรือข้อความปิดท้ายใดๆ (เช่น "นี่คือสรุปของคุณ...")
- ให้ส่งผลลัพธ์เริ่มด้วยข้อมูลสรุปตามโครงสร้างทันที เพื่อให้คัดลอกไปวางได้ 100%

--- 【ตัวอย่างผลลัพธ์ที่ถูกต้อง】 ---
${exampleOutput}
--- 【สิ้นสุดตัวอย่าง】 ---

เนื้อหาที่ต้องการให้คุณสรุป:
[วางเนื้อหา เลกเชอร์ หรือสไลด์ของคุณตรงนี้]`;
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
