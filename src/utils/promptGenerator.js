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
  emerald: '#bbf7d0',
  mint: '#bbf7d0',
  pink: '#fbcfe8',
  rose: '#fecdd3',
  red: '#fecaca',
  sky: '#bae6fd',
  blue: '#bae6fd',
  cyan: '#bae6fd',
  orange: '#fed7aa',
  amber: '#fed7aa',
  gold: '#fef08a',
  purple: '#e9d5ff',
  violet: '#e9d5ff',
  lavender: '#e9d5ff',
  lilac: '#e9d5ff'
};

/**
 * Normalizes all AI-generated highlight formats into clean, styled <mark> tags:
 * - Markdown ==text== -> yellow highlight
 * - Short tags: [hl=yellow]text[/hl], [mark=green]text[/mark], [highlight=pink]text[/highlight]
 * - Colorless tags: [hl]text[/hl], [mark]text[/mark], [highlight]text[/highlight] -> default yellow
 * - HTML <mark> without style -> default yellow
 */
export const normalizeHighlightTags = (text) => {
  if (!text) return '';
  let result = text;

  // 1. Markdown ==text== syntax (strictly 2 equals, excluding === page markers ===)
  result = result.replace(/(?<!=)==(?!=)([^\n=]+?)(?<!=)==(?!=)/g, (_m, txt) => {
    return `<mark style="background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
  });

  // 2. Short tags with color: [hl=yellow]text[/hl], [mark=green]text[/mark], [highlight=pink]text[/highlight]
  result = result.replace(/\[(?:hl|mark|highlight)=([#a-zA-Z0-9]+)\]([\s\S]*?)\[\/(?:hl|mark|highlight)\]/gi, (_m, col, txt) => {
    const hex = HIGHLIGHT_COLOR_MAP[col.toLowerCase()] || (col.startsWith('#') ? col : `#${col}`);
    return `<mark style="background-color: ${hex}; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
  });

  // 3. Short tags without color: [hl]text[/hl], [mark]text[/mark], [highlight]text[/highlight] (default yellow)
  result = result.replace(/\[(?:hl|mark|highlight)\]([\s\S]*?)\[\/(?:hl|mark|highlight)\]/gi, (_m, txt) => {
    return `<mark style="background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
  });

  // 4. HTML <mark> without style attribute or with color attribute
  result = result.replace(/<mark(?!\s+style)(?:\s+color=["']?([#a-zA-Z0-9]+)["']?)?[^>]*>([\s\S]*?)<\/mark>/gi, (_m, col, txt) => {
    const hex = col ? (HIGHLIGHT_COLOR_MAP[col.toLowerCase()] || (col.startsWith('#') ? col : `#${col}`)) : '#fef08a';
    return `<mark style="background-color: ${hex}; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
  });

  return result;
};

/**
 * Intelligent Auto-Highlight for text where AI forgot to highlight:
 * Detects key indicator words, quotes, and high-yield terms if the text has 0 highlights.
 */
export const autoHighlightText = (text) => {
  if (!text) return '';
  let result = text;

  // If text already has highlights (<mark>, ==, [hl), leave it intact
  if (/<mark/i.test(result) || /(?<!=)==(?!=)[^\n=]+?(?<!=)==(?!=)/.test(result) || /\[(?:hl|mark|highlight)/i.test(result)) {
    return result;
  }

  // 1. Highlight quotes "..." or “...”
  result = result.replace(/(["“])([^"”\n]{2,45})(["”])/g, (_m, open, inner, close) => {
    return `<mark style="background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px;">${open}${inner}${close}</mark>`;
  });

  // 2. Highlight critical exam/warning phrases
  result = result.replace(/([⚠️🚨]?\s*(?:ออกสอบ|เน้นออกสอบ|อาจารย์เน้น|ข้อควรระวัง|ระวัง:|สำคัญมาก|จำเป็นต้อง)[^\n|.,]{0,35})/gi, (_m, match) => {
    return `<mark style="background-color: #fbcfe8; color: inherit; padding: 1px 3px; border-radius: 3px;">${match.trim()}</mark>`;
  });

  // 3. Highlight superlatives (เร็วสุด, ช้าสุด, นิยมสุด, ดีที่สุด)
  result = result.replace(/([ก-๙a-zA-Z0-9\s]{2,20}(?:เร็วที่สุด|เร็วสุด|ช้าที่สุด|ช้าสุด|นิยมสุด|ดีที่สุด|แม่นยำสูงสุด))/g, (_m, match) => {
    return `<mark style="background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px;">${match.trim()}</mark>`;
  });

  return result;
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
7. 【กฎเหล็ก: บังคับใส่ไฮไลท์สีในทุกกล่อง (สำคัญมาก)】:
   - ทุกกล่องต้องใส่ไฮไลท์สีอย่างน้อย 1-3 จุด สำหรับคำสำคัญ จุดออกสอบ นิยาม หรือข้อควรระวัง ห้ามส่งกล่องที่ไม่มีไฮไลท์เด็ดขาด
   - ไวยากรณ์ไฮไลท์ที่ให้ใช้ (เลือกใช้รูปแบบที่เขียนง่ายที่สุด):
     * ไฮไลท์สีเหลือง (จุดสำคัญ/ออกสอบ): ==ข้อความสำคัญ== หรือ [hl=yellow]ข้อความ[/hl] หรือ <mark>ข้อความ</mark>
     * ไฮไลท์สีเขียว (นิยาม/ข้อดี): [hl=green]ข้อความ[/hl] หรือ [hl=lime]ข้อความ[/hl]
     * ไฮไลท์สีชมพู (ข้อควรระวัง/ความเร็ว/จุดเด่น): [hl=pink]ข้อความ[/hl]
     * ไฮไลท์สีฟ้า (ประเภท/ตัวอย่าง): [hl=blue]ข้อความ[/hl] หรือ [hl=sky]ข้อความ[/hl]
     * ไฮไลท์สีส้ม (สูตร/คำนวณ): [hl=orange]ข้อความ[/hl]
     * ไฮไลท์สีม่วง (หลักการ/ทฤษฎี): [hl=purple]ข้อความ[/hl]
     (หรือใช้ <mark style="background-color: #fef08a;">ข้อความ</mark> ก็ได้เช่นกัน)
8. สูตรและสมการคณิตศาสตร์ (เว็บรองรับการแสดงผล KaTeX / LaTeX คุณภาพสูงเต็มรูปแบบ):
   - เขียนสูตรด้วยไวยากรณ์ LaTeX มาตรฐาน เช่น \\frac{a}{b}, \\sqrt{x}, \\sum, \\int, \\times, x^2, x_i, \\approx
   - บล็อกสูตรหรือสมการสำคัญ ให้ครอบด้วย [formula]สมการ LaTeX[/formula] หรือ $$สมการ LaTeX$$
   - สมการหรือตัวแปรที่แทรกในบรรทัดเนื้อหา ให้ครอบด้วย $สมการ$ เช่น $f(x) = ax + b$ หรือ [formula]...[/formula]
   - ตัวอย่าง: [formula]\\sigma(z) = \\frac{1}{1 + e^{-z}}[/formula] หรือ [formula]d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}[/formula]
9. จัดจำนวนกล่องตามเนื้อหาจริง ให้แต่ละหน้ามีเนื้อหาพอดีกับ A4 ไม่กำหนดจำนวนกล่องตายตัว และอย่าตัดสาระสำคัญเพียงเพื่อบีบให้สั้น
10. ห้ามใส่คำเกริ่น คำทักทาย คำปิดท้าย หรือ code fence ให้เริ่มด้วย === หน้า 1 === ทันที
11. ทุกกล่องต้องมีเนื้อหา ห้ามสร้างกล่องเปล่า และห้ามใส่ ${delim} ก่อนหรือหลังบรรทัดหัวหน้า === หน้า 1 === หรือ === หน้า 2 === หรือต่อท้ายกล่องสุดท้าย

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
    const isFormula = trimmed.startsWith('[formula]') || trimmed.endsWith('[/formula]') ||
                      trimmed.startsWith('$$') || trimmed.endsWith('$$') ||
                      trimmed.startsWith('\\[') || trimmed.endsWith('\\]');
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
• <b>ALU:</b> ==คำนวณคณิตศาสตร์และตรรกะ== | <b>CU:</b> ถอดรหัสคำสั่งและคุมสัญญาณ | <b>Register:</b> [hl=pink]ความเร็วสูงสุดใน CPU[/hl]
• <b>วงรอบการทำงาน:</b> Fetch → Decode → Execute | <b>System Bus:</b> Data, Address, Control
• [formula]\\text{Cycle Time} = \\frac{1}{\\text{Frequency}}[/formula] | [formula]\\text{CPI} = \\frac{\\text{Cycles}}{\\text{Instruction}}[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Cache L1-L3:</b> ==เร็วสุด ความจุจำกัด== | <b>RAM:</b> หน่วยความจำหลัก Volatile ดับแล้วหาย | <b>SSD/HDD:</b> บันทึกข้อมูลถาวร
• <b>Virtual Memory:</b> ใช้พื้นที่ดิสก์จำลองเป็น RAM | <b>Paging:</b> แบ่งบล็อกขนาดเท่ากัน
• [formula]\\text{Capacity} = 2^{\\text{AddressLines}} \\times \\text{DataBits}[/formula]
${delim}
### 3. บิต ไบต์ และการแปลงหน่วยข้อมูล
• <b>Bit:</b> 0 หรือ 1 เล็กสุด | <b>Byte:</b> 8 Bits (256 สถานะ) | <b>สเต็ปแปลง:</b> 1 KB = 1024 B | 1 MB = 1024 KB
• [formula]\\text{Bits} \\div 8 = \\text{Bytes} \\to \\div 1024 = \\text{KB} \\to \\div 1024 = \\text{MB}[/formula]
${delim}
### 4. พีชคณิตบูลีน & Logic Gates
• <b>AND Gate:</b> เป็น 1 เมื่อทุกอินพุตเป็น 1 | <b>OR Gate:</b> เป็น 1 เมื่อมีอินพุตใดเป็น 1
• <b>De Morgan's Laws:</b> [formula]\\neg(A \\land B) = \\neg A \\lor \\neg B[/formula] | [formula]\\neg(A \\lor B) = \\neg A \\land \\neg B[/formula]

=== หน้า 2 ===
### 5. อัลกอริทึม & Time Complexity (Big-O)
• <b>O(1):</b> คงที่เข้าถึง Index | <b>O(log n):</b> Binary Search ([hl=green]ต้องเรียงข้อมูลก่อน[/hl]) | <b>O(n):</b> Linear Search
• <b>O(n log n):</b> Merge/Quick Sort (เฉลี่ย) | <b>O(n²):</b> Bubble Sort
${delim}
### 6. โครงสร้างข้อมูลพื้นฐาน (Data Structures)
• <b>Stack (LIFO):</b> เข้าหลังออกก่อน (ปุ่ม Undo) | <b>Queue (FIFO):</b> เข้าก่อนออกก่อน (คิวพิมพ์งาน)
• <b>Linked List:</b> ยืดหยุ่นแทรก/ลบเร็ว | <b>Hash Table:</b> ค้นหาเฉลี่ย O(1) ด้วยคีย์
${delim}
### 7. พื้นฐานระบบเครือข่าย & OSI Model
• <b>OSI 7 Layers:</b> 1.Physical → 2.Data Link → 3.Network → 4.Transport → 5.Session → 6.Presentation → 7.Application
• [hl=blue]TCP:[/hl] เชื่อถือได้ ตรวจสอบสูญหาย | [hl=orange]UDP:[/hl] รวดเร็ว ไม่เช็คสูญหาย
${delim}
### 8. ความปลอดภัยคอมพิวเตอร์ (CIA Triad)
• <b>Confidentiality:</b> รักษาความลับ เข้ารหัส | <b>Integrity:</b> ตรวจสอบความถูกต้องด้วย Hash
• <b>Availability:</b> พร้อมใช้งานตลอดเวลา มีระบบสำรองข้อมูล`;
};
