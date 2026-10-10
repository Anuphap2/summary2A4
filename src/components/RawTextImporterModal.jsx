import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Trash2, 
  Check, 
  X, 
  Merge,
  Copy,
  Bot,
  Eye,
  EyeOff,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

export default function RawTextImporterModal({ isOpen, onClose, onImportChunks }) {
  const [rawText, setRawText] = useState('');
  
  // Feature: เหลือเฉพาะกำหนดเครื่องหมายคั่นเอง
  const [customDelimiter, setCustomDelimiter] = useState('---');
  
  // AI System Prompt Generator Options
  const [promptPages, setPromptPages] = useState('2-pages'); // '2-pages' | '1-page'
  const [promptBoxes, setPromptBoxes] = useState('4'); // '4' | '6' | 'auto'
  const [promptStyle, setPromptStyle] = useState('exam'); // 'exam' | 'detailed'
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Target Destination & Options
  const [targetDestination, setTargetDestination] = useState('auto'); // 'auto' | 'balance' | 'page-1' | 'page-2'
  const [importAction, setImportAction] = useState('append'); // 'append' | 'replace'
  const [autoFormula, setAutoFormula] = useState(true);
  const [autoBoldKeys, setAutoBoldKeys] = useState(true);
  
  // Custom manual edit list for chunks
  const [manualChunks, setManualChunks] = useState([]);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);

  // Generate dynamic System Prompt for user to copy & paste into AI
  const systemPromptText = useMemo(() => {
    const isTwoPages = promptPages === '2-pages';
    const delim = customDelimiter.trim() || '---';
    const boxesDesc = promptBoxes === 'auto' 
      ? 'ประมาณ 4-6 กล่องต่อหน้า' 
      : `${promptBoxes} กล่องต่อหน้า`;
    const totalBoxesDesc = isTwoPages 
      ? (promptBoxes === 'auto' ? '8-12 กล่อง' : `${Number(promptBoxes) * 2} กล่อง`)
      : (promptBoxes === 'auto' ? '4-6 กล่อง' : `${promptBoxes} กล่อง`);

    const pageInstruction = isTwoPages
      ? `- สรุปสำหรับพิมพ์ลงกระดาษ A4 สองหน้า (หน้า 1 ด้านหน้า และ หน้า 2 ด้านหลัง) รวมทั้งหมดประมาณ ${totalBoxesDesc}
- บรรทัดแรกสุดของหน้า 1 ให้ขึ้นต้นด้วย: === หน้า 1 ===
- เมื่อจบเนื้อหาหน้า 1 และจะเริ่มหน้า 2 ให้คั่นด้วยบรรทัด: === หน้า 2 ===
- แต่ละหน้าควรมี ${boxesDesc} เพื่อให้จัดวางลงหน้ากระดาษ A4 ได้พอดี ไม่ล้นหน้า`
      : `- สรุปสำหรับพิมพ์ลงกระดาษ A4 หน้าเดียว (1 หน้า) จำนวนทั้งหมดประมาณ ${totalBoxesDesc}
- บรรทัดแรกสุด ให้ขึ้นต้นด้วย: === หน้า 1 ===
- ควรมี ${boxesDesc} เพื่อให้จัดวางลง 1 หน้า A4 ได้พอดี ไม่ล้นหน้า`;

    const styleInstruction = promptStyle === 'exam'
      ? `- สไตล์การสรุป: สรุปเข้มข้นสไตล์ Cheat Sheet สรุปสอบ เน้นคีย์เวิร์ด สูตร นิยาม และจุดที่มักออกสอบ
- ใช้ Bullet Point สั้นกระชับ ตัดน้ำทิ้งทั้งหมด ให้เหลือเฉพาะแก่นความรู้`
      : `- สไตล์การสรุป: สรุปเป็นระเบียบ เข้าใจง่าย อธิบายขั้นตอนและหลักการสำคัญอย่างครบถ้วน พร้อมตัวอย่างประกอบสั้นๆ`;

    return `คุณคือผู้ช่วยสรุปเนื้อหาและสร้าง Cheat Sheet สรุปสอบระดับมืออาชีพ สำหรับพิมพ์ลงกระดาษ A4

【เป้าหมาย】
นำเนื้อหา/เอกสาร/สไลด์ที่ผู้ใช้ระบุ มาสรุปและจัดเป็น "กล่องสรุป (Cards)" เพื่อนำไปวางในโปรแกรมสร้างใบสรุป A4

【กฎรูปแบบโครงสร้าง (Format Rules) ที่ต้องปฏิบัติตามอย่างเคร่งครัด】

1. การจัดหน้ากระดาษ:
${pageInstruction}

2. การแบ่งกล่องสรุป (สำคัญที่สุด):
- ให้คั่นระหว่างแต่ละกล่องสรุปด้วยเครื่องหมาย: ${delim}
- บรรทัดแรกสุดของแต่ละกล่อง ให้ตั้งชื่อหัวข้อโดยขึ้นต้นด้วย "### [ลำดับ]. [ชื่อหัวข้อสั้นกระชับ]" เช่น "### 1. โครงสร้างข้อมูล Stack & Queue"
- (ทางเลือก) สามารถระบุแท็กหมวดหมู่ในบรรทัดถัดมาได้ เช่น "[แท็ก: โครงสร้างข้อมูล]"

3. การจัดฟอร์แมตเนื้อหาภายในกล่อง:
${styleInstruction}
- เน้นคำสำคัญ/ศัพท์เฉพาะ ด้วยแท็กตัวหนา: <b>คำสำคัญ:</b> คำอธิบาย
- ไฮไลท์ข้อความสำคัญ (Highlighter) จุดที่ต้องจำแม่นๆ หรือจุดออกสอบ:
  ให้ครอบด้วยแท็ก: <mark style="background-color: #fef08a;">ข้อความที่เน้น</mark>
  (เฉดสีไฮไลท์ที่ระบบรองรับ: เหลือง #fef08a, เขียว #bbf7d0, ชมพู #fbcfe8, ฟ้า #bae6fd, ส้ม #fed7aa, ม่วง #e9d5ff)
- หากมีสูตรคำนวณ สมการ หรือคณิตศาสตร์ ให้ครอบด้วยแท็ก: [formula]สมการที่นี่[/formula]
- ความยาวเนื้อหาต่อกล่อง: ประมาณ 200 - 450 ตัวอักษร ให้กระชับพอดีกับการแสดงผลลงแผ่น A4

4. ข้อห้าม:
- ห้ามพิมพ์คำทักทาย เกริ่นนำ หรือข้อความปิดท้ายใดๆ (เช่น "นี่คือสรุปของคุณ...")
- ให้ส่งผลลัพธ์เริ่มด้วยข้อมูลสรุปตามโครงสร้างทันที เพื่อให้คัดลอกไปวางได้ทันที 100%

--- 【ตัวอย่างผลลัพธ์ที่ถูกต้อง】 ---
${isTwoPages ? `=== หน้า 1 ===\n` : `=== หน้า 1 ===\n`}### 1. สถาปัตยกรรมคอมพิวเตอร์ & CPU
• <b>ALU (Arithmetic Logic Unit):</b> ทำหน้าที่ประมวลผล<mark style="background-color: #fef08a;">คำนวณคณิตศาสตร์และตรรกะ</mark>
• <b>Control Unit (CU):</b> ถอดรหัสคำสั่งและสั่งการจังหวะการทำงาน
• <b>Register:</b> หน่วยความจำ<mark style="background-color: #fbcfe8;">ความเร็วสูงสุด</mark>ในตัว CPU
• [formula]Cycle Time = 1 / Frequency  |  CPI = Cycles / Instruction[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Register & Cache L1-L3:</b> ความเร็วสูงสุด ความจุจำกัด ต้นทุนสูง
• <b>RAM:</b> หน่วยความจำหลัก ชั่วคราว (Volatile)
• <b>Secondary Storage:</b> SSD/HDD บันทึกข้อมูลถาวร
• [formula]Capacity = 2^AddressLines × DataBits[/formula]
${isTwoPages ? `\n=== หน้า 2 ===\n### 3. อัลกอริทึมและการเรียงลำดับ (Sorting)
• <b>Bubble Sort:</b> [formula]O(n²)[/formula] สลับสมาชิกคู่ติดกัน
• <b>Quick Sort:</b> [formula]O(n log n)[/formula] เฉลี่ย <mark style="background-color: #fed7aa;">มี Pivot</mark>
• <b>Binary Search:</b> [formula]O(log n)[/formula] <mark style="background-color: #bbf7d0;">ข้อมูลต้องเรียงลำดับก่อนเสมอ</mark>
${delim}
### 4. ความปลอดภัยข้อมูล (CIA Triad)
• <mark style="background-color: #bae6fd;">Confidentiality:</mark> รักษาความลับ เข้ารหัสข้อมูล ป้องกันการดักฟัง
• <mark style="background-color: #e9d5ff;">Integrity:</mark> ตรวจสอบความถูกต้องสมบูรณ์ด้วย Hashing
• <b>Availability:</b> ป้องกันระบบล่ม มีระบบสำรองข้อมูล` : ''}
--- 【สิ้นสุดตัวอย่าง】 ---

เนื้อหาที่ต้องการให้คุณสรุป:
[วางเนื้อหา เลกเชอร์ หรือสไลด์ของคุณตรงนี้]`;
  }, [promptPages, promptBoxes, promptStyle, customDelimiter]);

  // Handle Copy Prompt to Clipboard
  const handleCopyPrompt = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(systemPromptText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = systemPromptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      setCopiedPrompt(false);
    }
  };

  // Compute chunks based strictly on customDelimiter
  const computedChunks = useMemo(() => {
    if (!rawText.trim()) return [];

    const delim = customDelimiter.trim() || '---';
    const initialParts = rawText.split(delim);
    const rawParts = [];

    // Ensure headers stuck to text or multiple headers in one chunk are cleanly separated
    initialParts.forEach((p) => {
      const normalized = p.replace(/([^\n\s])(#{2,4}\s+[0-9A-Za-zก-๙])/g, '$1\n$2');
      const subParts = normalized.split(/(?=(?:^|\n)#{2,4}\s+[0-9A-Za-zก-๙])/);
      subParts.forEach(sp => {
        if (sp.trim()) rawParts.push(sp.trim());
      });
    });
    
    let currentPage = 1;
    const sections = [];
    const colors = ['lilac', 'lime', 'coral', 'mint', 'cream', 'pink', 'sky'];

    rawParts.forEach((part) => {
      let raw = part.trim();
      if (!raw) return;

      // Detect page header marker e.g. === หน้า 1 === or === หน้า 2 === or === Page 2 ===
      const pageHeaderMatch = raw.match(/(?:^|\n)\s*(?:={3,}|#{2,}|-{3,}|\[)?\s*(?:หน้า\s*([1-9])|Page\s*([1-9])|ด้านหน้า|ด้านหลัง)\s*(?:={3,}|#{2,}|-{3,}|\])?\s*(?:\n|$)/i);
      if (pageHeaderMatch) {
        const matchedPageNum = pageHeaderMatch[1] || pageHeaderMatch[2];
        if (matchedPageNum) {
          currentPage = Number(matchedPageNum);
        } else if (pageHeaderMatch[0].includes('ด้านหน้า')) {
          currentPage = 1;
        } else if (pageHeaderMatch[0].includes('ด้านหลัง')) {
          currentPage = 2;
        }
        // Remove page marker line from card content
        raw = raw.replace(pageHeaderMatch[0], '').trim();
      }

      if (!raw) return;

      // Extract title, tag, and content from remaining lines
      const lines = raw.split('\n');
      let title = '';
      let tag = '';
      let contentLines = [];
      let isTitleFound = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check tag line e.g. [แท็ก: ...] or แท็ก: ...
        const tagMatch = trimmedLine.match(/^\[?(?:แท็ก|Tag)\s*[:：]\s*(.+?)(?:\])?$/i);
        if (tagMatch) {
          tag = tagMatch[1].trim();
          continue;
        }

        // Check title if not yet found
        if (!isTitleFound) {
          const mdHeader = trimmedLine.match(/^#{1,4}\s+(.+)$/);
          const explicitTitle = trimmedLine.match(/^(?:หัวข้อ|Topic|Title)\s*[:：]\s*(.+)$/i);
          const numberedHeader = trimmedLine.match(/^[0-9]{1,2}[.)]\s+(.+)$/);

          if (mdHeader) {
            title = mdHeader[1].trim();
            isTitleFound = true;
            continue;
          } else if (explicitTitle) {
            title = explicitTitle[1].trim();
            isTitleFound = true;
            continue;
          } else if (numberedHeader && numberedHeader[1].length < 60) {
            title = trimmedLine;
            isTitleFound = true;
            continue;
          } else if (trimmedLine.length > 0 && trimmedLine.length <= 50 && i === 0 && lines.length > 1) {
            title = trimmedLine;
            isTitleFound = true;
            continue;
          }
        }

        contentLines.push(line);
      }

      let body = contentLines.join('\n').trim();

      // Fallbacks if title is empty
      if (!title) {
        if (body) {
          const firstLine = body.split('\n')[0].trim();
          if (firstLine.length <= 40) {
            title = firstLine;
            body = body.split('\n').slice(1).join('\n').trim();
          } else {
            title = `กล่องที่ ${sections.length + 1}`;
          }
        } else {
          title = `กล่องที่ ${sections.length + 1}`;
        }
      }

      if (!tag) {
        tag = `หน้า ${currentPage} • กล่องที่ ${sections.length + 1}`;
      }

      // Post-process formatting
      if (autoBoldKeys) {
        body = body.replace(/^([A-Za-z0-9ก-๙\s]{2,25}):\s*/gm, '<b>$1:</b> ');
      }

      if (autoFormula) {
        body = body.replace(/^((?:(?:\\text\{[^}]+\}|[a-zA-Z\d_]+)\s*(?:=|\\ge|\\le|≥|≤)\s*[^;\n]+|d\s*=\s*√[^;\n]+))\s*$/gm, '[formula]$1[/formula]');
      }

      // Normalize any highlight syntax from AI
      const highlightColorMap = {
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
      // 1. [hl=color]...[/hl] or [mark=color]...[/mark]
      body = body.replace(/\[(?:hl|mark|highlight)=([#a-zA-Z0-9]+)\]([\s\S]*?)\[\/(?:hl|mark|highlight)\]/gi, (_m, col, txt) => {
        const hex = highlightColorMap[col.toLowerCase()] || (col.startsWith('#') ? col : `#${col}`);
        return `<mark style="background-color: ${hex}; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
      });
      // 2. Unstyled <mark>... -> default yellow
      body = body.replace(/<mark(?!\s+style)>/gi, '<mark style="background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px;">');

      sections.push({
        id: `chunk-${sections.length}-${title.slice(0, 15).replace(/\s+/g, '_')}`,
        title: title.replace(/^#+\s*/, '') || `กล่องที่ ${sections.length + 1}`,
        tag: tag,
        targetPage: currentPage,
        colorTheme: colors[sections.length % colors.length],
        content: body
      });
    });

    return sections;
  }, [rawText, customDelimiter, autoFormula, autoBoldKeys]);

  // Synchronize manual edits with computed chunks
  const activeChunks = hasCustomEdits ? manualChunks : computedChunks;

  // Analysis of page distribution
  const page1Count = activeChunks.filter(c => c.targetPage !== 2).length;
  const page2Count = activeChunks.filter(c => c.targetPage === 2).length;
  const hasPageMarkers = page2Count > 0;

  const handleTextChange = (e) => {
    setRawText(e.target.value);
    setHasCustomEdits(false);
  };

  const handleUpdateChunkTitle = (index, newTitle) => {
    const list = [...activeChunks];
    list[index].title = newTitle;
    setManualChunks(list);
    setHasCustomEdits(true);
  };

  const handleUpdateChunkContent = (index, newContent) => {
    const list = [...activeChunks];
    list[index].content = newContent;
    setManualChunks(list);
    setHasCustomEdits(true);
  };

  const handleToggleChunkPage = (index) => {
    const list = [...activeChunks];
    const current = list[index].targetPage || 1;
    list[index].targetPage = current === 1 ? 2 : 1;
    list[index].tag = `หน้า ${list[index].targetPage} • กล่องที่ ${index + 1}`;
    setManualChunks(list);
    setHasCustomEdits(true);
  };

  const handleDeleteChunk = (index) => {
    const list = [...activeChunks];
    list.splice(index, 1);
    setManualChunks(list);
    setHasCustomEdits(true);
  };

  const handleMergeChunk = (index) => {
    if (index >= activeChunks.length - 1) return;
    const list = [...activeChunks];
    list[index].content = `${list[index].content}\n\n${list[index + 1].content}`;
    list.splice(index + 1, 1);
    setManualChunks(list);
    setHasCustomEdits(true);
  };

  const handleApplyImport = () => {
    if (activeChunks.length === 0) return;
    onImportChunks({
      chunks: activeChunks,
      targetDestination,
      importAction
    });
    onClose();
  };

  // Sample Output from AI matching the custom delimiter
  const handleLoadSampleNotes = () => {
    const delim = customDelimiter.trim() || '---';
    setRawText(`=== หน้า 1 ===
### 1. สถาปัตยกรรมคอมพิวเตอร์ & CPU
• <b>ALU (Arithmetic Logic Unit):</b> ประมวลผล<mark style="background-color: #fef08a;">คำนวณคณิตศาสตร์และตรรกะ</mark>
• <b>Control Unit (CU):</b> ถอดรหัสคำสั่งและสั่งการจังหวะการทำงาน
• <b>Register:</b> หน่วยความจำ<mark style="background-color: #fbcfe8;">ความเร็วสูงสุด</mark>ในตัว CPU
• [formula]Cycle Time = 1 / Frequency  |  CPI = Cycles / Instruction[/formula]
${delim}
### 2. ลำดับชั้นหน่วยความจำ (Memory Hierarchy)
• <b>Cache L1/L2/L3:</b> หน่วยความจำแคชความเร็วสูงใกล้ชิด CPU
• <b>RAM (Main Memory):</b> หน่วยความจำหลัก ชั่วคราว (Volatile)
• <b>Secondary Storage:</b> SSD/HDD บันทึกข้อมูลถาวร
• [formula]Capacity = 2^AddressLines × DataBits[/formula]
${delim}
### 3. บิต ไบต์ และการแปลงหน่วยข้อมูล
• <b>Bit:</b> หน่วยข้อมูลเล็กสุด (0 หรือ 1)
• <b>Byte:</b> 1 Byte = 8 Bits แทนค่าได้ 256 สถานะ
• <b>สเต็ปแปลงหน่วย:</b>
  - 1 KB = 1,024 Bytes  |  1 MB = 1,024 KB
• [formula]Bits ÷ 8 = Bytes → ÷ 1024 = KB → ÷ 1024 = MB[/formula]
${delim}
### 4. พีชคณิตบูลีน & Logic Gates
• <b>AND Gate:</b> เป็น 1 เมื่อทุกอินพุตเป็น 1
• <b>OR Gate:</b> เป็น 1 เมื่อมีอินพุตใดอินพุตหนึ่งเป็น 1
• <b>De Morgan's Laws:</b>
  - [formula]~(A ∧ B) = ~A ∨ ~B[/formula]
  - [formula]~(A ∨ B) = ~A ∧ ~B[/formula]

=== หน้า 2 ===
### 5. อัลกอริทึม & Time Complexity (Big-O)
• <b>O(1):</b> คงที่ เช่น เข้าถึงอาเรย์ตาม index
• <b>O(log n):</b> Binary Search (<mark style="background-color: #bbf7d0;">ต้องเรียงข้อมูลก่อนเสมอ</mark>)
• <b>O(n):</b> Linear Search ค้นหาทีละตัว
• <b>O(n log n):</b> Merge Sort, Quick Sort (เฉลี่ย)
• <b>O(n²):</b> Bubble Sort ในกรณีแย่สุด
${delim}
### 6. โครงสร้างข้อมูลพื้นฐาน (Data Structures)
• <b>Stack (LIFO):</b> เข้าทีหลังออกก่อน เช่น ปุ่ม Undo
• <b>Queue (FIFO):</b> เข้าก่อนออกก่อน เช่น คิวพิมพ์งาน
• <b>Linked List:</b> แทรก/ลบข้อมูลได้เร็ว ขนาดขยายได้ยืดหยุ่น
• <b>Hash Table:</b> ค้นหาเฉลี่ย O(1) ด้วยคีย์
${delim}
### 7. พื้นฐานระบบเครือข่าย & OSI Model
• <b>OSI 7 Layers:</b>
  1. Physical → 2. Data Link → 3. Network → 4. Transport
  5. Session → 6. Presentation → 7. Application
• <mark style="background-color: #bae6fd;">TCP:</mark> Connection-oriented เชื่อถือได้ เช็คสูญหาย
• <mark style="background-color: #fed7aa;">UDP:</mark> Connectionless รวดเร็ว ไม่เช็คสูญหาย
${delim}
### 8. ความปลอดภัยคอมพิวเตอร์ (CIA Triad)
• <b>Confidentiality:</b> รักษาความลับ เข้ารหัสข้อมูล ป้องกันการดักฟัง
• <b>Integrity:</b> ความถูกต้องสมบูรณ์ ตรวจสอบด้วย Hashing
• <b>Availability:</b> ความพร้อมใช้งาน ป้องกันล่มด้วยระบบสำรอง`);
    setHasCustomEdits(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-300 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">
                  ระบบยัดข้อความดิบ & AI System Prompt
                </h2>
                <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                  Custom Delimiter Mode
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                คัดลอก Prompt สั่ง AI สรุปและแบ่งหน้า/กล่องคั่น แล้วนำข้อความมาวางเพื่อสร้างแผ่น A4 ทันที
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-neutral-200 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
          
          {/* Left Column: AI Prompt Generator + Delimiter Input + Raw Text */}
          <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[58vh] lg:max-h-[78vh]">
            
            {/* 🤖 FEATURE: AI System Prompt Helper Card */}
            <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white border border-indigo-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      AI System Prompt Generator
                    </span>
                    <span className="text-[10px] text-indigo-700 block">
                      คัดลอกไปสั่ง ChatGPT, Claude, Gemini สรุปให้ตรงฟอร์แมต A4 เป๊ะ
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleLoadSampleNotes}
                  className="text-[11px] text-indigo-700 hover:text-indigo-950 bg-indigo-100/70 hover:bg-indigo-200 px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>ลองใส่ตัวอย่างผลลัพธ์</span>
                </button>
              </div>

              {/* Prompt Customization Options */}
              <div className="bg-white/90 border border-indigo-100 rounded-xl p-2.5 space-y-2 text-xs">
                
                {/* Row 1: Page Layout */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-neutral-600">จำนวนหน้าสรุป:</span>
                  <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPromptPages('2-pages')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition ${
                        promptPages === '2-pages'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      📄 2 หน้า (หน้า-หลัง)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptPages('1-page')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition ${
                        promptPages === '1-page'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      📄 1 หน้าเดียว
                    </button>
                  </div>
                </div>

                {/* Row 2: Density / Boxes per Page */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-neutral-600">ความหนาแน่น:</span>
                  <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPromptBoxes('4')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition ${
                        promptBoxes === '4' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      4 กล่อง/หน้า (อ่านสบาย)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptBoxes('6')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition ${
                        promptBoxes === '6' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      6 กล่อง/หน้า (อัดแน่น)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptBoxes('auto')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition ${
                        promptBoxes === 'auto' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      พอดีเนื้อหา
                    </button>
                  </div>
                </div>

                {/* Row 3: Summary Style */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-neutral-600">สไตล์สรุป:</span>
                  <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPromptStyle('exam')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition ${
                        promptStyle === 'exam' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      🎯 เน้นสอบ (CheatSheet)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptStyle('detailed')}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition ${
                        promptStyle === 'detailed' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      📖 ละเอียด เข้าใจง่าย
                    </button>
                  </div>
                </div>

              </div>

              {/* Prompt Action Buttons: Copy & Toggle Preview */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    copiedPrompt
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
                  }`}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>คัดลอกสำเร็จ! นำไปวางใน AI ได้เลย</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>คัดลอก System Prompt สำหรับ AI</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-900 transition flex items-center gap-1.5"
                  title="ดูข้อความ System Prompt ทั้งหมด"
                >
                  {showPromptPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPromptPreview ? 'ซ่อน' : 'ดู Prompt'}</span>
                </button>
              </div>

              {/* Collapsible Prompt Preview */}
              {showPromptPreview && (
                <div className="mt-2 p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-neutral-700">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1.5 border-b border-neutral-800 pb-1">
                    <span>ตัวอย่างข้อความ System Prompt ที่จะส่งให้ AI:</span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="text-indigo-300 hover:text-white flex items-center gap-1 font-sans"
                    >
                      <Copy className="w-3 h-3" /> คัดลอก
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">{systemPromptText}</pre>
                </div>
              )}
            </div>

            {/* ✂️ FEATURE: เหลือเฉพาะกำหนดเครื่องหมายคั่นเอง */}
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
                  กำหนดเครื่องหมายคั่นกล่องสรุป (Delimiter)
                </span>
                <span className="text-[10px] text-neutral-500">
                  ตัดแบ่งกล่องตามเครื่องหมายนี้
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent">
                  <span className="text-[11px] text-neutral-500 font-medium">เครื่องหมาย:</span>
                  <input
                    type="text"
                    value={customDelimiter}
                    onChange={(e) => { 
                      setCustomDelimiter(e.target.value); 
                      setHasCustomEdits(false); 
                    }}
                    placeholder="เช่น ---"
                    className="text-xs font-mono font-bold text-neutral-900 bg-transparent w-24 focus:outline-none"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-neutral-400 text-[10px]">ตัวเลือกด่วน:</span>
                  {['---', '===', '***', '###'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCustomDelimiter(preset);
                        setHasCustomEdits(false);
                      }}
                      className={`px-2 py-1 rounded-lg font-mono text-[11px] border transition ${
                        customDelimiter === preset
                          ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10.5px] text-neutral-500 leading-normal">
                💡 ทุกจุดที่พบเครื่องหมาย <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-800 font-mono font-bold">{customDelimiter || '---'}</code> ในข้อความด้านล่าง จะถูกตัดแยกออกเป็นหนึ่งกล่องการ์ดสรุปบนกระดาษ A4
              </p>
            </div>

            {/* Input Header & Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  วางข้อความที่ได้จาก AI หรือข้อความของคุณที่นี่
                </label>
                {rawText.length > 0 && (
                  <button
                    onClick={() => { setRawText(''); setHasCustomEdits(false); }}
                    className="text-[10.5px] text-rose-600 hover:text-rose-800 transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ล้างข้อความ</span>
                  </button>
                )}
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={rawText}
                  onChange={handleTextChange}
                  placeholder={`วางผลลัพธ์ข้อความจาก AI ที่นี่ เช่น:
=== หน้า 1 ===
### 1. สถาปัตยกรรมคอมพิวเตอร์
• รายละเอียด...
${customDelimiter || '---'}
### 2. โครงสร้างข้อมูล
• รายละเอียด...`}
                  rows={9}
                  className="w-full text-xs font-mono p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-y leading-relaxed"
                />
              </div>

              {/* Info Badges */}
              <div className="flex flex-wrap justify-between items-center text-[10px] text-neutral-500 px-1 gap-1">
                <span>
                  {rawText.length.toLocaleString()} ตัวอักษร | {rawText.trim() ? rawText.trim().split(/\s+/).length : 0} คำ
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                    สร้างได้ {activeChunks.length} กล่องสรุป
                  </span>
                  {hasPageMarkers && (
                    <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      ✨ หน้า 1: {page1Count} กล่อง | หน้า 2: {page2Count} กล่อง
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Destination & Placement Settings */}
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-2.5">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-700" />
                การจัดวางลงหน้ากระดาษ A4
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetDestination('auto')}
                  className={`p-2 rounded-xl text-center border transition ${
                    targetDestination === 'auto'
                      ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-[11px]">✨ ตรวจจับอัตโนมัติ</div>
                  <div className="text-[9px] opacity-80">แยกหน้า 1 & 2 ตามข้อความ</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDestination('balance')}
                  className={`p-2 rounded-xl text-center border transition ${
                    targetDestination === 'balance'
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-[11px]">⚖️ กระจาย 2 หน้า</div>
                  <div className="text-[9px] opacity-80">แบ่งหน้า 1 และ 2 เท่ากัน</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDestination('page-1')}
                  className={`p-2 rounded-xl text-center border transition ${
                    targetDestination === 'page-1'
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-[11px]">📄 หน้า 1 เท่านั้น</div>
                  <div className="text-[9px] opacity-80">ใส่เฉพาะหน้าแรก</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDestination('page-2')}
                  className={`p-2 rounded-xl text-center border transition ${
                    targetDestination === 'page-2'
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-[11px]">📄 หน้า 2 เท่านั้น</div>
                  <div className="text-[9px] opacity-80">ใส่เฉพาะหน้าหลัง</div>
                </button>
              </div>

              {/* Append vs Replace */}
              <div className="flex items-center gap-4 text-xs pt-1 border-t border-neutral-200/80">
                <span className="text-neutral-500 font-medium">รูปแบบการใส่:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importAction"
                    value="append"
                    checked={importAction === 'append'}
                    onChange={() => setImportAction('append')}
                    className="accent-neutral-900"
                  />
                  <span>เพิ่มต่อท้ายการ์ดเดิม (Append)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importAction"
                    value="replace"
                    checked={importAction === 'replace'}
                    onChange={() => setImportAction('replace')}
                    className="accent-neutral-900"
                  />
                  <span className="text-rose-600 font-semibold">แทนที่ทั้งหมด (Replace)</span>
                </label>
              </div>

              {/* Formatting Toggles */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-700 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBoldKeys}
                    onChange={(e) => setAutoBoldKeys(e.target.checked)}
                    className="rounded accent-neutral-900"
                  />
                  <span>เน้นตัวหนาให้ "คำสำคัญ:" อัตโนมัติ</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFormula}
                    onChange={(e) => setAutoFormula(e.target.checked)}
                    className="rounded accent-neutral-900"
                  />
                  <span>จัดรูปแบบสูตร [formula] อัตโนมัติ</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Live Chunk Cards Preview & Adjustment */}
          <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col bg-neutral-50/50 max-h-[58vh] lg:max-h-[78vh]">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  พรีวิวกล่องสรุปที่จะสร้าง ({activeChunks.length} กล่อง)
                </span>
                {hasCustomEdits && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    แก้ไขเองแล้ว
                  </span>
                )}
              </div>
              <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                {activeChunks.length > 0 && (
                  <span>
                    หน้า 1 ({page1Count}) • หน้า 2 ({page2Count})
                  </span>
                )}
              </div>
            </div>

            {/* Chunk List Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeChunks.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl bg-white text-neutral-400 space-y-2">
                  <FileText className="w-10 h-10 stroke-1 text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-700">ยังไม่มีเนื้อหาที่จะแบ่งกล่อง</p>
                  <p className="text-[11px] text-neutral-400 max-w-sm leading-relaxed">
                    1. กดปุ่ม <b>"คัดลอก System Prompt"</b> ด้านซ้ายไปวางใน AI พร้อมเนื้อหาของคุณ<br />
                    2. นำผลลัพธ์ที่ได้มาวางในกล่องข้อความ หรือกดปุ่ม <b>"ลองใส่ตัวอย่างผลลัพธ์"</b>
                  </p>
                </div>
              ) : (
                activeChunks.map((chunk, idx) => (
                  <div 
                    key={chunk.id || idx}
                    className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs hover:border-neutral-400 transition space-y-2 group"
                  >
                    {/* Chunk Card Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2 gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        {/* Page Indicator Badge / Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleChunkPage(idx)}
                          title="คลิกเพื่อสลับหน้าระหว่างหน้า 1 และ หน้า 2"
                          className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full transition shrink-0 cursor-pointer ${
                            chunk.targetPage === 2
                              ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          📄 {chunk.targetPage === 2 ? 'หน้า 2 (หลัง)' : 'หน้า 1 (หน้า)'}
                        </button>

                        <input
                          type="text"
                          value={chunk.title}
                          onChange={(e) => handleUpdateChunkTitle(idx, e.target.value)}
                          className="font-bold text-xs text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none w-full px-1 py-0.5 rounded"
                        />
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {idx < activeChunks.length - 1 && (
                          <button
                            title="รวมกับกล่องถัดไป"
                            onClick={() => handleMergeChunk(idx)}
                            className="p-1 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 rounded transition"
                          >
                            <Merge className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          title="ลบกล่องนี้"
                          onClick={() => handleDeleteChunk(idx)}
                          className="p-1 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Chunk Card Body (Editable) */}
                    <textarea
                      value={chunk.content}
                      onChange={(e) => handleUpdateChunkContent(idx, e.target.value)}
                      rows={3}
                      className="w-full text-[11px] leading-relaxed text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-transparent focus:border-neutral-300 rounded-lg p-2 font-sans resize-y focus:outline-none"
                    />

                    <div className="flex justify-between items-center text-[9px] text-neutral-400 pt-0.5">
                      <span className={chunk.content.length > 450 ? 'text-amber-600 font-medium' : ''}>
                        {chunk.content.length} ตัวอักษร {chunk.content.length > 450 ? '(ยาวเกินไปอาจล้น A4)' : ''}
                      </span>
                      <span className="text-neutral-500 font-medium">ธีมสี: {chunk.colorTheme}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-200 bg-neutral-50/90 flex items-center justify-between">
          <div className="text-xs text-neutral-600">
            {activeChunks.length > 0 ? (
              <span>
                พร้อมสร้าง <b>{activeChunks.length} กล่องสรุป</b> (หน้า 1: {page1Count} กล่อง, หน้า 2: {page2Count} กล่อง)
              </span>
            ) : (
              <span>วางข้อความที่มีเครื่องหมายคั่นเพื่อเริ่มสร้างกล่อง</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-200 border border-neutral-200 transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              disabled={activeChunks.length === 0}
              onClick={handleApplyImport}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>นำเข้าลงใบสรุป A4 เดี๋ยวนี้</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
