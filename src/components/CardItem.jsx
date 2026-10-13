import React, { useState, useRef, useEffect } from 'react';
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Code, 
  ArrowRightLeft,
  List,
  Edit3,
  Check,
  Highlighter,
  MoreHorizontal,
  Scissors,
  Zap,
  ChevronsUp,
  ChevronsDown
} from 'lucide-react';
import { COLOR_THEMES } from '../data/defaultData';
import { compactContentWithPipeAndColor, HIGHLIGHT_COLOR_MAP } from '../utils/promptGenerator';
import { renderLatexToHtml, normalizeMathDelimiters } from '../utils/mathRenderer';

export default function CardItem({ 
  card, 
  pageIndex, 
  cardIndex, 
  totalCards, 
  fontSizeConfig, 
  layoutMode = 'masonry',
  onUpdateCard, 
  onDeleteCard, 
  onDuplicateCard, 
  onMoveCard, 
  onTransferPage,
  onSplitCard,
  isDragOver,
  dragOverPosition = null,
  onDragStart,
  onDragOver,
  onDrop
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editContentText, setEditContentText] = useState(card.content);
  const textareaRef = useRef(null);
  const titleTextareaRef = useRef(null);
  const moreMenuRef = useRef(null);

  const currentTheme = COLOR_THEMES.find(t => t.id === card.colorTheme) || COLOR_THEMES[0];
  const isCheatsheet = layoutMode === 'cheatsheet';

  // Auto-resize title textarea on mount and title change
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [card.title]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMoreMenu]);

  // Helper to parse content with formulas [formula]...[/formula], inline formulas, HTML markup, and styled pipe separators
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Normalize LaTeX math delimiters ($$, \[, \(, $, [formula]) and multi-formula pipes
    let normalizedContent = normalizeMathDelimiters(content);

    // Support short highlight tags: [hl=yellow]text[/hl], [hl=pink]text[/hl], etc.
    normalizedContent = normalizedContent.replace(/\[(?:hl|mark)=([a-zA-Z0-9#]+)\]([\s\S]*?)\[\/(?:hl|mark)\]/gi, (_m, col, txt) => {
      const hex = HIGHLIGHT_COLOR_MAP[col.toLowerCase()] || (col.startsWith('#') ? col : `#${col}`);
      return `<mark style="background-color: ${hex}; color: inherit; padding: 1px 3px; border-radius: 3px;">${txt}</mark>`;
    });

    // Split by formula tags [formula]...[/formula] and [formula-inline]...[/formula-inline]
    const parts = normalizedContent.split(/(\[formula\][\s\S]*?\[\/formula\]|\[formula-inline\][\s\S]*?\[\/formula-inline\])/g);

    return parts.map((part, idx) => {
      if (part.startsWith('[formula]') && part.endsWith('[/formula]')) {
        const eq = part.replace(/^\[formula\]/, '').replace(/\[\/formula\]$/, '').trim();
        const html = renderLatexToHtml(eq, { displayMode: !isCheatsheet });
        const FormulaElement = isCheatsheet ? 'span' : 'div';
        return (
          <FormulaElement
            key={idx} 
            data-formula={eq}
            className={`formula-box select-text ${isCheatsheet ? 'formula-box-compact' : 'formula-box-block my-0.5 px-1.5 py-0.5 rounded bg-neutral-900/5 border border-neutral-900/10'}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (part.startsWith('[formula-inline]') && part.endsWith('[/formula-inline]')) {
        const eq = part.replace(/^\[formula-inline\]/, '').replace(/\[\/formula-inline\]$/, '').trim();
        const html = renderLatexToHtml(eq, { displayMode: false });
        return (
          <span
            key={idx}
            data-formula={eq}
            className="formula-inline select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        // Render regular lines with basic HTML support (<b>, <i>, <mark>, <br>)
        // Compress excessive blank lines and style pipe divider | cleanly
        const formattedPart = part
          .replace(/\n{3,}/g, '\n\n')
          .replace(/(\s+\|\s+|(?<=[^\s|])\s*\|\s*(?=[^\s|]))/g, ' <span class="inline-pipe-divider select-none">|</span> ')
          .replace(/\n/g, '<br />');

        return (
          <span 
            key={idx} 
            dangerouslySetInnerHTML={{ __html: formattedPart }} 
          />
        );
      }
    });
  };

  const handleInsertFormula = () => {
    const updated = `${card.content}\n[formula]f(x) = \\frac{a}{b}[/formula]`;
    onUpdateCard(card.id, { content: updated });
  };

  const handleInsertBullet = () => {
    const updated = `${card.content}\n- <b>หัวข้อย่อย:</b> อธิบายความหมาย`;
    onUpdateCard(card.id, { content: updated });
  };

  // Textarea edit helpers
  const handleInsertHighlightInEditor = (color = '#fef08a') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = editContentText.substring(start, end) || 'ข้อความไฮไลท์';
    const before = editContentText.substring(0, start);
    const after = editContentText.substring(end);
    const replacement = `<mark style="background-color: ${color}; color: inherit; padding: 1px 3px; border-radius: 3px;">${selected}</mark>`;
    const updated = before + replacement + after;
    setEditContentText(updated);
  };

  const handleInsertFormulaInEditor = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = editContentText.substring(start, end) || 'f(x) = \\frac{a}{b}';
    const before = editContentText.substring(0, start);
    const after = editContentText.substring(end);
    const updated = `${before}\n[formula]${selected}[/formula]\n${after}`;
    setEditContentText(updated);
  };

  const handleInsertBoldInEditor = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = editContentText.substring(start, end) || 'คำสำคัญ';
    const before = editContentText.substring(0, start);
    const after = editContentText.substring(end);
    const updated = `${before}<b>${selected}:</b> ${after}`;
    setEditContentText(updated);
  };

  const handleInsertPipeInEditor = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const before = editContentText.substring(0, start);
    const after = editContentText.substring(end);
    const updated = `${before} | ${after}`;
    setEditContentText(updated);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + 3;
        textareaRef.current.selectionEnd = start + 3;
        textareaRef.current.focus();
      }
    }, 10);
  };

  const handleCompactCurrentCard = () => {
    const compacted = compactContentWithPipeAndColor(card.content);
    onUpdateCard(card.id, { content: compacted });
  };

  const handleCompactEditorText = () => {
    const compacted = compactContentWithPipeAndColor(editContentText);
    setEditContentText(compacted);
  };

  const handleSaveInlineEdit = () => {
    onUpdateCard(card.id, { content: editContentText });
    setIsEditingContent(false);
  };

  return (
    <div
      draggable={!isEditingContent}
      onDragStart={(e) => onDragStart(e, card.id, pageIndex, cardIndex)}
      onDragOver={(e) => onDragOver(e, cardIndex)}
      onDrop={(e) => onDrop(e, cardIndex)}
      style={{ 
        backgroundColor: currentTheme.bg,
        borderColor: currentTheme.border 
      }}
      className={`border rounded-lg ${fontSizeConfig.cardPadding} shadow-xs hover:shadow-md transition-all duration-150 relative group h-fit flex flex-col ${isCheatsheet ? 'cheatsheet-card' : ''} ${
        isDragOver ? 'ring-2 ring-indigo-600 scale-[1.01]' : ''
      }`}
    >
      {/* Visual Drop Placement Indicators */}
      {isDragOver && dragOverPosition === 'before' && (
        <div className="absolute -top-1.5 left-0 right-0 h-1 bg-indigo-600 rounded-full z-40 shadow-sm pointer-events-none" />
      )}
      {isDragOver && dragOverPosition === 'after' && (
        <div className="absolute -bottom-1.5 left-0 right-0 h-1 bg-indigo-600 rounded-full z-40 shadow-sm pointer-events-none" />
      )}

      {/* Top Card Header */}
      <div 
        className={`flex items-start justify-between border-b pb-0.5 mb-1 gap-1 cheatsheet-card-header ${isCheatsheet ? 'mb-0.5 cheatsheet-flow-title' : ''}`}
        style={{ borderColor: `${currentTheme.border}` }}
      >
        <div className="flex items-start gap-1 flex-1 min-w-0 pr-1">
          {/* Drag Handle */}
          <span 
            className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700 drag-handle p-0.5 rounded transition no-print shrink-0 mt-0.5"
            title="ลากเพื่อย้ายตำแหน่ง"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </span>

          {/* Title with full width and auto-wrapping */}
          <textarea
            ref={titleTextareaRef}
            value={card.title}
            onChange={(e) => onUpdateCard(card.id, { title: e.target.value })}
            rows={1}
            style={{ color: currentTheme.accent }}
            placeholder="หัวข้อกล่อง..."
            className={`font-extrabold ${isCheatsheet ? 'text-[8px]' : 'text-[11px]'} leading-snug bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none w-full px-0.5 py-0.2 resize-none overflow-hidden cheatsheet-card-title`}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>

        {/* Card Header Actions (no-print) */}
        <div className="card-action-bar no-print flex items-center gap-0.5 shrink-0 transition">
          {/* Toggle Edit Content Button */}
          <button
            type="button"
            onClick={() => {
              if (isEditingContent) {
                handleSaveInlineEdit();
              } else {
                setEditContentText(card.content);
                setIsEditingContent(true);
              }
            }}
            title={isEditingContent ? "บันทึกการแก้ไข" : "แก้ไขข้อความกล่องนี้"}
            className={`p-1 rounded transition ${
              isEditingContent 
                ? 'bg-neutral-900 text-white hover:bg-black' 
                : 'hover:bg-black/5 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {isEditingContent ? <Check className="w-3 h-3 text-emerald-300" /> : <Edit3 className="w-3 h-3" />}
          </button>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="เมนูตัวเลือกเพิ่มเติม"
              className="p-1 rounded hover:bg-black/5 text-neutral-500 hover:text-neutral-900 transition"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>

            {showMoreMenu && (
              <div 
                ref={moreMenuRef}
                className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl p-1.5 shadow-xl z-40 w-44 text-xs animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5 text-neutral-800"
              >
                {/* Theme Palette Bar */}
                <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 flex items-center justify-between">
                  <span>เลือกสีธีมกล่อง:</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 border-b border-neutral-100 pb-1.5 mb-1">
                  {COLOR_THEMES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onUpdateCard(card.id, { colorTheme: t.id });
                        setShowMoreMenu(false);
                      }}
                      style={{ backgroundColor: t.chip }}
                      title={t.name}
                      className={`w-4.5 h-4.5 rounded-full border transition cursor-pointer ${
                        card.colorTheme === t.id ? 'ring-2 ring-neutral-900 scale-110' : 'border-neutral-300 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>

                {/* Split card if has content */}
                {onSplitCard && (
                  <button
                    type="button"
                    onClick={() => {
                      onSplitCard(card.id);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <Scissors className="w-3 h-3 text-amber-600" />
                    <span>ตัดแบ่งกล่องนี้ (Split Card)</span>
                  </button>
                )}

                {/* Auto-Compact Sub-bullets with Pipe */}
                <button
                  type="button"
                  onClick={() => {
                    handleCompactCurrentCard();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-indigo-50 text-indigo-700 flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
                  title="บีบรวมข้อย่อยในกล่องนี้ให้เป็นแนวนอนคั่นด้วย | เพื่อประหยัดพื้นที่กระดาษ A4"
                >
                  <Zap className="w-3 h-3 text-indigo-600" />
                  <span>บีบข้อย่อยเป็น | (ลดที่)</span>
                </button>

                {/* Transfer Page to End */}
                <button
                  type="button"
                  onClick={() => {
                    onTransferPage(card.id, pageIndex === 0 ? 1 : 0);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                >
                  <ArrowRightLeft className="w-3 h-3 text-neutral-500" />
                  <span>{pageIndex === 0 ? "ย้ายไปหน้า 2 (ต่อท้าย)" : "ย้ายไปหน้า 1 (ต่อท้าย)"}</span>
                </button>

                {/* Move to Top */}
                {cardIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveCard(cardIndex, 0);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <ChevronsUp className="w-3 h-3 text-indigo-600" />
                    <span>ย้ายไปบนสุด</span>
                  </button>
                )}

                {/* Move Up */}
                {cardIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveCard(cardIndex, cardIndex - 1);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3 text-neutral-500" />
                    <span>เลื่อนขึ้น (1 ลำดับ)</span>
                  </button>
                )}

                {/* Move Down */}
                {cardIndex < totalCards - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveCard(cardIndex, cardIndex + 1);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3 text-neutral-500" />
                    <span>เลื่อนลง (1 ลำดับ)</span>
                  </button>
                )}

                {/* Move to End */}
                {cardIndex < totalCards - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveCard(cardIndex, totalCards - 1);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <ChevronsDown className="w-3 h-3 text-indigo-600" />
                    <span>ย้ายไปท้ายสุด</span>
                  </button>
                )}

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => {
                    onDuplicateCard(card.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-100 text-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-neutral-500" />
                  <span>ทำซ้ำกล่องนี้</span>
                </button>

                <div className="border-t border-neutral-100 my-0.5"></div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCard(card.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 text-[11px] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>ลบกล่องนี้</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className={`min-h-[35px] text-neutral-800 leading-tight ${isCheatsheet ? 'min-h-0' : ''} cheatsheet-card-content`}>
        {isEditingContent ? (
          /* Inline Text Editor */
          <div className="flex flex-col gap-1.5 my-1 animate-in fade-in duration-100">
            <textarea
              ref={textareaRef}
              value={editContentText}
              onChange={(e) => setEditContentText(e.target.value)}
              rows={Math.max(4, editContentText.split('\n').length)}
              className="w-full text-[10.5px] leading-relaxed font-sans p-2 bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none resize-y shadow-inner"
              placeholder="พิมพ์ข้อความสรุป..."
              autoFocus
            />
            {/* Quick edit helper toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[9px] pt-1 border-t border-black/5">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleInsertHighlightInEditor('#fef08a')}
                  className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition flex items-center gap-0.5 cursor-pointer"
                  title="ใส่ไฮไลท์สีเหลือง"
                >
                  <Highlighter className="w-2.5 h-2.5 text-amber-600" />
                  + ไฮไลท์
                </button>
                <button
                  type="button"
                  onClick={handleInsertPipeInEditor}
                  className="px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 text-neutral-800 font-bold transition flex items-center gap-0.5 cursor-pointer"
                  title="แทรกเครื่องหมาย | เพื่อคั่นประเด็นย่อยในบรรทัดเดียวกัน"
                >
                  + คั่น |
                </button>
                <button
                  type="button"
                  onClick={handleCompactEditorText}
                  className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition flex items-center gap-0.5 cursor-pointer"
                  title="บีบรวมข้อย่อยที่ขึ้นบรรทัดใหม่ให้มาอยู่ในบรรทัดเดียวกันคั่นด้วย |"
                >
                  <Zap className="w-2.5 h-2.5 text-indigo-600" />
                  บีบเป็น |
                </button>
                <button
                  type="button"
                  onClick={handleInsertFormulaInEditor}
                  className="px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 text-neutral-700 transition cursor-pointer"
                >
                  + สูตร
                </button>
                <button
                  type="button"
                  onClick={handleInsertBoldInEditor}
                  className="px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 text-neutral-700 font-bold transition cursor-pointer"
                >
                  + ตัวหนา
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsEditingContent(false)}
                  className="px-2 py-0.5 rounded border border-neutral-300 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveInlineEdit}
                  className="px-2.5 py-0.5 rounded bg-neutral-900 hover:bg-black text-white font-semibold transition cursor-pointer"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formatted View with Text Selection & Highlighter Support */
          <div 
            data-card-id={card.id}
            data-card-content="true"
            data-page-index={pageIndex}
            onDoubleClick={() => {
              setEditContentText(card.content);
              setIsEditingContent(true);
            }}
            title="ลากคลุมข้อความเพื่อไฮไลท์สี หรือดับเบิ้ลคลิกเพื่อแก้ไขข้อความ"
            className="card-content-area outline-none rounded px-0.5 py-0.5 cursor-text select-text"
          >
            {renderFormattedContent(card.content)}
          </div>
        )}
      </div>

      {/* Bottom Micro Toolbar (only visible on hover when not editing, hidden during print) */}
      {!isEditingContent && (
        <div className="no-print mt-1 pt-1 border-t border-black/5 flex items-center justify-between text-[9px] text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-150">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleInsertFormula}
              className="hover:text-neutral-800 bg-black/5 hover:bg-black/10 px-1.5 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <Code className="w-2.5 h-2.5" />
              + สูตรคำนวณ
            </button>
            <button
              type="button"
              onClick={handleInsertBullet}
              className="hover:text-neutral-800 bg-black/5 hover:bg-black/10 px-1.5 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <List className="w-2.5 h-2.5" />
              + ข้อย่อย
            </button>
          </div>

          <span className="font-mono text-[8px] text-neutral-400">
            {card.content.length} ตัวอักษร
          </span>
        </div>
      )}
    </div>
  );
}
