import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import A4Page from './components/A4Page';
import RawTextImporterModal from './components/RawTextImporterModal';
import TextHighlightToolbar from './components/TextHighlightToolbar';
import Toast from './components/Toast';
import { initialPagesData, FONT_SIZES } from './data/defaultData';
import { generateSystemPrompt } from './utils/promptGenerator';
import { removePage } from './utils/pageActions';
import { ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'a4_cheatsheet_studio_pages';
const FONT_STORAGE_KEY = 'a4_cheatsheet_studio_font';

export default function App() {
  // 1. Pages state with localStorage persistence
  const [pages, setPages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved sheets', e);
    }
    return initialPagesData;
  });

  // 2. Font configuration state
  const [fontSizeId, setFontSizeId] = useState(() => {
    return localStorage.getItem(FONT_STORAGE_KEY) || 'normal';
  });

  // 3. Orientation state ('portrait' | 'landscape')
  const [orientation, setOrientation] = useState(() => {
    return localStorage.getItem('a4_cheatsheet_orientation') || 'portrait';
  });

  // 4. View mode & Zoom level
  const [viewMode, setViewMode] = useState('stacked'); // 'stacked' | 'side-by-side'
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // 5. Modals & Notifications
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showStudentGuide, setShowStudentGuide] = useState(true);

  // 6. Drag & Drop state
  const [draggedCardInfo, setDraggedCardInfo] = useState(null);

  const activeFontSize = FONT_SIZES.find(f => f.id === fontSizeId) || FONT_SIZES[1];

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (e) {
      console.error('Auto save error', e);
    }
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, fontSizeId);
  }, [fontSizeId]);

  useEffect(() => {
    localStorage.setItem('a4_cheatsheet_orientation', orientation);
  }, [orientation]);

  // Keyboard shortcuts (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
        setToast({ message: 'บันทึกข้อมูลและโครงร่างลงเครื่องสำเร็จ!', type: 'success' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Page level updates
  const handleUpdatePage = (pageId, updates) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
  };

  const handleDeletePage = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    if (!page || pages.length <= 1) return;

    const message = page.cards.length > 0
      ? `ต้องการลบหน้า ${page.pageNumber} และกล่องสรุป ${page.cards.length} กล่องในหน้านี้ใช่หรือไม่?`
      : `ต้องการลบหน้า ${page.pageNumber} ที่ว่างอยู่นี้ใช่หรือไม่?`;
    if (!window.confirm(message)) return;

    setPages(prev => removePage(prev, pageId));
    showNotification(`ลบหน้า ${page.pageNumber} แล้ว`, 'info');
  };

  // Add new card to a page
  const handleAddCard = (pageIndex) => {
    const colors = ['lilac', 'lime', 'coral', 'mint', 'cream', 'pink'];
    const newCard = {
      id: `card-${Date.now()}`,
      title: '✏️ หัวข้อใหม่ (คลิกแก้ไขข้อความ)',
      tag: 'ทั่วไป',
      colorTheme: colors[Math.floor(Math.random() * colors.length)],
      content: `• สรุปสาระสำคัญ:
- พิมพ์เนื้อหาของคุณที่นี่ หรือใส่สูตรคำนวณ [formula]สมการ = ตัวแปร[/formula]
- รองรับ <b>ตัวหนา</b> และ <i>ตัวเอียง</i>`
    };

    setPages(prev => {
      const copy = [...prev];
      copy[pageIndex] = {
        ...copy[pageIndex],
        cards: [...copy[pageIndex].cards, newCard]
      };
      return copy;
    });

    showNotification(`เพิ่มกล่องสรุปใหม่ในหน้า ${pageIndex + 1} แล้ว`);
  };

  // Update card content or properties
  const handleUpdateCard = (pageIndex, cardId, updates) => {
    setPages(prev => {
      const copy = [...prev];
      copy[pageIndex] = {
        ...copy[pageIndex],
        cards: copy[pageIndex].cards.map(c => c.id === cardId ? { ...c, ...updates } : c)
      };
      return copy;
    });
  };

  // Delete card
  const handleDeleteCard = (pageIndex, cardId) => {
    if (window.confirm('คุณต้องการลบกล่องสรุปนี้ใช่หรือไม่?')) {
      setPages(prev => {
        const copy = [...prev];
        copy[pageIndex] = {
          ...copy[pageIndex],
          cards: copy[pageIndex].cards.filter(c => c.id !== cardId)
        };
        return copy;
      });
      showNotification('ลบกล่องสรุปแล้ว', 'info');
    }
  };

  // Duplicate card
  const handleDuplicateCard = (pageIndex, cardId) => {
    setPages(prev => {
      const copy = [...prev];
      const targetCard = copy[pageIndex].cards.find(c => c.id === cardId);
      if (!targetCard) return prev;

      const duplicated = {
        ...targetCard,
        id: `card-${Date.now()}`,
        title: `${targetCard.title} (สำเนา)`
      };

      const cardIdx = copy[pageIndex].cards.findIndex(c => c.id === cardId);
      const newCards = [...copy[pageIndex].cards];
      newCards.splice(cardIdx + 1, 0, duplicated);

      copy[pageIndex] = {
        ...copy[pageIndex],
        cards: newCards
      };
      return copy;
    });
    showNotification('คัดลอกกล่องสรุปเรียบร้อย');
  };

  // Reorder card within the same page
  const handleMoveCard = (pageIndex, fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= pages[pageIndex].cards.length) return;

    setPages(prev => {
      const copy = [...prev];
      const items = [...copy[pageIndex].cards];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      copy[pageIndex] = { ...copy[pageIndex], cards: items };
      return copy;
    });
  };

  // Transfer card between pages
  const handleTransferPage = (cardId, targetPageIndex, targetIndex = null) => {
    setPages(prev => {
      // Find which page the card is currently on
      let foundCard = null;
      let fromPageIndex = -1;

      prev.forEach((p, pIdx) => {
        const c = p.cards.find(item => item.id === cardId);
        if (c) {
          foundCard = c;
          fromPageIndex = pIdx;
        }
      });

      if (!foundCard || fromPageIndex === -1 || fromPageIndex === targetPageIndex) {
        return prev;
      }

      const copy = [...prev];
      // Remove from source page
      copy[fromPageIndex] = {
        ...copy[fromPageIndex],
        cards: copy[fromPageIndex].cards.filter(c => c.id !== cardId)
      };

      // Add to target page
      const targetCards = [...copy[targetPageIndex].cards];
      if (targetIndex !== null && targetIndex >= 0) {
        targetCards.splice(targetIndex, 0, foundCard);
      } else {
        targetCards.push(foundCard);
      }

      copy[targetPageIndex] = {
        ...copy[targetPageIndex],
        cards: targetCards
      };

      return copy;
    });

    showNotification(`ย้ายกล่องสรุปไปยังหน้า ${targetPageIndex + 1} เรียบร้อย`);
  };

  // Split a card into two (e.g. if topic was merged or card is too long)
  const handleSplitCard = (pageIndex, cardId) => {
    setPages(prev => {
      const copy = [...prev];
      const cardList = [...copy[pageIndex].cards];
      const cardIdx = cardList.findIndex(c => c.id === cardId);
      if (cardIdx === -1) return prev;

      const targetCard = cardList[cardIdx];
      const content = targetCard.content || '';

      // Check if there is an embedded heading like ### or ## or Topic:
      const headingMatch = content.match(/(?:^|\n|[^\n])(#{2,4}\s+[^\n]+)/);
      
      let firstPartContent = '';
      let secondPartTitle = '';
      let secondPartContent = '';

      if (headingMatch) {
        const matchIndex = headingMatch.index;
        const actualHeadingStart = content.indexOf(headingMatch[1], matchIndex);
        firstPartContent = content.substring(0, actualHeadingStart).trim();
        
        const rest = content.substring(actualHeadingStart);
        const headingLineEnd = rest.indexOf('\n');
        if (headingLineEnd !== -1) {
          secondPartTitle = rest.substring(0, headingLineEnd).replace(/^#{2,4}\s+/, '').trim();
          secondPartContent = rest.substring(headingLineEnd + 1).trim();
        } else {
          secondPartTitle = rest.replace(/^#{2,4}\s+/, '').trim();
          secondPartContent = '';
        }
      } else {
        // No heading found: split roughly in half at a bullet point or newline
        const lines = content.split('\n');
        if (lines.length > 2) {
          const mid = Math.ceil(lines.length / 2);
          firstPartContent = lines.slice(0, mid).join('\n').trim();
          secondPartContent = lines.slice(mid).join('\n').trim();
          secondPartTitle = `${targetCard.title} (ตอนที่ 2)`;
        } else {
          const mid = Math.floor(content.length / 2);
          firstPartContent = content.substring(0, mid).trim();
          secondPartContent = content.substring(mid).trim();
          secondPartTitle = `${targetCard.title} (ตอนที่ 2)`;
        }
      }

      const updatedFirstCard = {
        ...targetCard,
        content: firstPartContent
      };

      const colors = ['lilac', 'lime', 'coral', 'mint', 'cream', 'pink', 'sky'];
      const nextColor = colors[(colors.indexOf(targetCard.colorTheme) + 1) % colors.length] || 'mint';

      const newSecondCard = {
        id: `card-${Date.now()}`,
        title: secondPartTitle || `${targetCard.title} (ตอนที่ 2)`,
        tag: targetCard.tag || 'ทั่วไป',
        colorTheme: nextColor,
        content: secondPartContent
      };

      cardList.splice(cardIdx, 1, updatedFirstCard, newSecondCard);
      copy[pageIndex] = { ...copy[pageIndex], cards: cardList };
      return copy;
    });

    showNotification('✂️ ตัดแบ่งกล่องสรุปเรียบร้อยแล้ว');
  };

  // Auto move overflowing last card to the next page
  const handleAutoMoveOverflow = (pageIndex) => {
    setPages(prev => {
      const copy = [...prev];
      const sourcePage = copy[pageIndex];
      if (!sourcePage || sourcePage.cards.length <= 1) return prev;

      const lastCard = sourcePage.cards[sourcePage.cards.length - 1];
      const remainingCards = sourcePage.cards.slice(0, -1);
      copy[pageIndex] = { ...sourcePage, cards: remainingCards };

      const targetPageIndex = pageIndex + 1;
      if (copy[targetPageIndex]) {
        copy[targetPageIndex] = {
          ...copy[targetPageIndex],
          cards: [lastCard, ...copy[targetPageIndex].cards]
        };
      } else {
        copy.push({
          id: `page-${Date.now()}`,
          pageNumber: targetPageIndex + 1,
          title: `${sourcePage.title} (หน้า ${targetPageIndex + 1})`,
          subtitle: sourcePage.subtitle,
          columns: sourcePage.columns || 4,
          layoutMode: sourcePage.layoutMode || 'masonry',
          accentColor: sourcePage.accentColor || '#111827',
          cards: [lastCard]
        });
      }

      return copy;
    });

    showNotification(`ย้ายกล่องสรุปท้ายสุดไปยังหน้า ${pageIndex + 2} เรียบร้อย`);
  };

  // Smart Chunk Import Handler
  const handleImportChunks = ({ chunks, targetDestination, importAction }) => {
    if (!chunks || chunks.length === 0) return;

    setPages(prev => {
      const copy = [...prev];

      // Auto mode: detect if chunks specify page 1 vs page 2
      if (targetDestination === 'auto') {
        const hasP2 = chunks.some(c => c.targetPage === 2);
        if (hasP2) {
          const p1Chunks = chunks.filter(c => c.targetPage !== 2);
          const p2Chunks = chunks.filter(c => c.targetPage === 2);

          if (importAction === 'replace') {
            copy[0] = { ...copy[0], cards: p1Chunks };
            if (copy[1]) copy[1] = { ...copy[1], cards: p2Chunks };
          } else {
            copy[0] = { ...copy[0], cards: [...copy[0].cards, ...p1Chunks] };
            if (copy[1]) copy[1] = { ...copy[1], cards: [...copy[1].cards, ...p2Chunks] };
          }
          return copy;
        }
      }

      if (targetDestination === 'balance' || targetDestination === 'auto') {
        // Distribute evenly between page 1 and page 2
        const half = Math.ceil(chunks.length / 2);
        const p1Chunks = chunks.slice(0, half);
        const p2Chunks = chunks.slice(half);

        if (importAction === 'replace') {
          copy[0] = { ...copy[0], cards: p1Chunks };
          if (copy[1]) copy[1] = { ...copy[1], cards: p2Chunks };
        } else {
          copy[0] = { ...copy[0], cards: [...copy[0].cards, ...p1Chunks] };
          if (copy[1]) copy[1] = { ...copy[1], cards: [...copy[1].cards, ...p2Chunks] };
        }
      } else if (targetDestination === 'page-1') {
        if (importAction === 'replace') {
          copy[0] = { ...copy[0], cards: chunks };
        } else {
          copy[0] = { ...copy[0], cards: [...copy[0].cards, ...chunks] };
        }
      } else if (targetDestination === 'page-2') {
        if (copy[1]) {
          if (importAction === 'replace') {
            copy[1] = { ...copy[1], cards: chunks };
          } else {
            copy[1] = { ...copy[1], cards: [...copy[1].cards, ...chunks] };
          }
        }
      }

      return copy;
    });

    showNotification(`จัดแบ่งและนำเข้าสำเร็จ! เพิ่ม ${chunks.length} กล่องสรุปแล้ว`);
  };

  // Save explicitly
  const handleSaveContent = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    showNotification('บันทึกข้อมูลและโครงร่างลงเครื่องสำเร็จ!');
  };

  // Reset to default
  const handleResetDefault = () => {
    if (window.confirm('คุณต้องการรีเซ็ตกลับเป็นข้อมูลตัวอย่างตั้งต้นหรือไม่? การแก้ไขทั้งหมดจะถูกแทนที่')) {
      localStorage.removeItem(STORAGE_KEY);
      setPages(initialPagesData);
      showNotification('รีเซ็ตกลับเป็นตัวอย่างเดิมเรียบร้อย');
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `a4_cheatsheet_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('ดาวน์โหลดไฟล์สำรองเรียบร้อย');
  };

  // Import JSON
  const handleImportJson = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPages(parsed);
            showNotification('กู้คืนข้อมูลสำเร็จ!');
          } else {
            showNotification('รูปแบบไฟล์ JSON ไม่ถูกต้อง', 'error');
          }
        } catch {
          showNotification('ไม่สามารถเปิดไฟล์ JSON ได้', 'error');
        }
      };
    }
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    let md = `# A4 Study Cheat Sheet Summary\n\n`;
    pages.forEach(p => {
      md += `## ${p.title}\n`;
      md += `*${p.subtitle}*\n\n`;
      p.cards.forEach(c => {
        md += `### ${c.title}\n`;
        md += `${c.content.replace(/\[formula\]/g, '```\n').replace(/\[\/formula\]/g, '\n```')}\n\n`;
      });
      md += `---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `a4_summary_notes.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('ส่งออกเป็นไฟล์ Markdown สำเร็จ');
  };

  // Quick Copy AI System Prompt directly from Navbar
  const handleQuickCopyAiPrompt = async () => {
    try {
      const prompt = generateSystemPrompt();
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showNotification('🤖 คัดลอก Prompt ชีท A4 รูปแบบเดียวกับเนื้อหาปัจจุบันแล้ว');
    } catch {
      showNotification('ไม่สามารถคัดลอกได้ กรุณาเปิดหน้าต่างยัดข้อความดิบเพื่อคัดลอก', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* Navbar with full tool controls */}
      <Navbar
        fontSizeId={fontSizeId}
        setFontSizeId={setFontSizeId}
        orientation={orientation}
        onChangeOrientation={setOrientation}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenImporter={() => setIsImporterOpen(true)}
        onQuickCopyAiPrompt={handleQuickCopyAiPrompt}
        onSaveContent={handleSaveContent}
        onResetDefault={handleResetDefault}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Dynamic Print CSS for A4 Orientation */}
      <style>{`
        @media print {
          @page {
            size: A4 ${orientation} !important;
            margin: ${orientation === 'landscape' ? '5mm' : '6mm'} !important;
          }
        }
      `}</style>

      {/* Student Guide / Companion banner (no-print) */}
      <div className="no-print max-w-[1240px] mx-auto px-4 w-full mb-4">
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowStudentGuide(!showStudentGuide)}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">
                🎓
              </span>
              <span className="text-xs font-bold text-neutral-900">
                คู่มือสำหรับนักศึกษาทำสรุปสอบ A4 2 หน้า (Cheat Sheet Guide)
              </span>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                เคล็ดลับจัดหน้า ({orientation === 'landscape' ? 'โหมดแนวนอน' : 'โหมดแนวตั้ง'})
              </span>
            </div>
            <button className="text-neutral-400 hover:text-neutral-700">
              {showStudentGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showStudentGuide && (
            <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-neutral-600">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <span className="text-indigo-600 font-mono">01.</span> สลับแนวตั้ง / แนวนอน
                </div>
                <p className="text-[11px] leading-relaxed">
                  กดสลับ <b>"แนวตั้ง"</b> หรือ <b>"แนวนอน"</b> บนแถบเมนูได้ทันที หากเลือกแนวนอน แนะนำให้ปรับเป็น <b>3 หรือ 4 คอลัมน์</b> เพื่อแบ่งเนื้อหาเป็นช่องตารางอ่านง่าย
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <span className="text-emerald-600 font-mono">02.</span> สังเกตแถบ "เตือนความยาว A4"
                </div>
                <p className="text-[11px] leading-relaxed">
                  ด้านบนของแต่ละหน้ามีแถบวัดความสูงอัตโนมัติ หากเตือนสีแดง ให้ย้ายบางกล่องไปหน้า 2 หรือใช้ปุ่ม <b>"บีบข้อย่อยเป็น |"</b> เพื่อลดความสูงทันที
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
                  <span className="text-indigo-600 font-mono">03.</span> 🚀 โหมดอัดแน่นด้วย | และสี
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-900">
                  ใช้ปุ่ม <b>"คัดลอก Prompt AI"</b> สั่งให้ AI รวบข้อย่อยในแนวนอนคั่นด้วย <b>" | "</b> และไฮไลท์สี ลดพื้นที่ว่างได้กว่า 50% ไม่ต้องมานั่งจัดเอง!
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <span className="text-amber-600 font-mono">04.</span> การพิมพ์ & ส่งออก PDF
                </div>
                <p className="text-[11px] leading-relaxed">
                  เมื่อกดปุ่ม <b>"พิมพ์ / PDF"</b> ระบบจะส่งคำสั่งพิมพ์ตามแนวที่เลือกไว้ ตั้งค่าขอบ (Margins) เป็น <b>None/Default</b> จะได้สรุป A4 พอดี 100%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <main className="flex-1 px-4 pb-12 flex justify-center overflow-x-auto">
        <div 
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}
          className={`w-full flex ${
            viewMode === 'side-by-side' 
              ? 'flex-row flex-wrap justify-center gap-8' 
              : 'flex-col items-center gap-6'
          }`}
        >
          {pages.map((page, pIdx) => (
            <A4Page
              key={page.id}
              page={page}
              pageIndex={pIdx}
              totalPages={pages.length}
              fontSizeConfig={activeFontSize}
              orientation={orientation}
              onUpdatePage={handleUpdatePage}
              onDeletePage={handleDeletePage}
              onAddCard={handleAddCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
              onDuplicateCard={handleDuplicateCard}
              onMoveCard={handleMoveCard}
              onTransferPage={handleTransferPage}
              onSplitCard={handleSplitCard}
              onAutoMoveOverflow={handleAutoMoveOverflow}
              draggedCardInfo={draggedCardInfo}
              setDraggedCardInfo={setDraggedCardInfo}
            />
          ))}
        </div>
      </main>

      {/* Raw Text Importer & Chunking Modal */}
      <RawTextImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportChunks={handleImportChunks}
        pages={pages}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating Text Highlighter Toolbar */}
      <TextHighlightToolbar onUpdateCard={handleUpdateCard} />

    </div>
  );
}
