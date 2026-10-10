import React, { useState, useEffect, useRef } from 'react';
import { 
  Highlighter, 
  Eraser, 
  Bold, 
  X, 
  Palette 
} from 'lucide-react';

// Preset fluorescent & pastel highlighter colors
const HIGHLIGHT_COLORS = [
  { id: 'yellow', name: 'เหลืองนีออน (คลาสสิก)', hex: '#fef08a', border: '#facc15' },
  { id: 'lime', name: 'เขียวสะท้อนแสง', hex: '#bbf7d0', border: '#4ade80' },
  { id: 'pink', name: 'ชมพูไฮไลท์', hex: '#fbcfe8', border: '#f472b6' },
  { id: 'sky', name: 'ฟ้าสดใส', hex: '#bae6fd', border: '#38bdf8' },
  { id: 'orange', name: 'ส้มพีช', hex: '#fed7aa', border: '#fb923c' },
  { id: 'purple', name: 'ม่วงลาเวนเดอร์', hex: '#e9d5ff', border: '#c084fc' }
];

/**
 * Serializes container DOM back to card content string,
 * preserving [formula] tags, <mark> highlights, <b> tags, and newlines.
 */
const serializeContainerToContent = (container) => {
  if (!container) return '';
  const clone = container.cloneNode(true);

  // Replace formula divs with [formula]...[/formula]
  const formulaBoxes = clone.querySelectorAll('[data-formula]');
  formulaBoxes.forEach(box => {
    const formulaText = box.getAttribute('data-formula') || box.innerText.trim();
    const textNode = document.createTextNode(`\n[formula]${formulaText}[/formula]\n`);
    box.parentNode.replaceChild(textNode, box);
  });

  // Replace <br> with \n
  const brs = clone.querySelectorAll('br');
  brs.forEach(br => {
    br.parentNode.replaceChild(document.createTextNode('\n'), br);
  });

  let html = clone.innerHTML;
  // Clean up excessive newlines
  html = html.replace(/\n{3,}/g, '\n\n').trim();
  return html;
};

export default function TextHighlightToolbar({ onUpdateCard }) {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentSelection, setCurrentSelection] = useState(null);
  const [customColor, setCustomColor] = useState('#fef08a');
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        // Do not immediately close if clicking inside the toolbar
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        return;
      }

      const range = selection.getRangeAt(0);

      // Check if selection is inside a card content area
      const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer.closest('[data-card-content]')
        : range.commonAncestorContainer.parentElement?.closest('[data-card-content]');

      if (!container) {
        return;
      }

      const cardId = container.getAttribute('data-card-id');
      const pageIndex = Number(container.getAttribute('data-page-index') || 0);

      if (!cardId) return;

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return;

      // Position toolbar above the selection, or below if too close to top
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      
      const top = rect.top < 65 
        ? rect.bottom + scrollY + 8 
        : rect.top + scrollY - 48;

      const left = Math.max(
        12, 
        Math.min(window.innerWidth - 330, rect.left + scrollX + (rect.width / 2) - 140)
      );

      setPosition({ top, left });
      setCurrentSelection({
        range: range.cloneRange(),
        container,
        cardId,
        pageIndex,
        text
      });
      setToolbarVisible(true);
    };

    const handleDocumentMouseDown = (e) => {
      // If clicking outside toolbar and outside selection, hide toolbar
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setToolbarVisible(false);
        }
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, []);

  const handleApplyColor = (color) => {
    if (!currentSelection) return;
    const { range, container, cardId, pageIndex } = currentSelection;

    if (color === 'clear') {
      // Remove mark highlight
      const markParent = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer.closest('mark')
        : range.commonAncestorContainer.parentElement?.closest('mark');

      if (markParent) {
        const parent = markParent.parentNode;
        while (markParent.firstChild) {
          parent.insertBefore(markParent.firstChild, markParent);
        }
        parent.removeChild(markParent);
      } else {
        const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
        if (ancestor) {
          const marks = ancestor.querySelectorAll('mark');
          marks.forEach(m => {
            if (range.intersectsNode(m)) {
              const parent = m.parentNode;
              while (m.firstChild) {
                parent.insertBefore(m.firstChild, m);
              }
              parent.removeChild(m);
            }
          });
        }
      }
    } else {
      // Apply or update highlight
      const existingMark = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer.closest('mark')
        : range.commonAncestorContainer.parentElement?.closest('mark');

      if (existingMark) {
        existingMark.style.backgroundColor = color;
      } else {
        const mark = document.createElement('mark');
        mark.style.backgroundColor = color;
        mark.style.color = 'inherit';
        mark.style.padding = '1px 3px';
        mark.style.borderRadius = '3px';

        try {
          range.surroundContents(mark);
        } catch {
          const fragment = range.extractContents();
          // Remove any nested marks in the extracted fragment
          fragment.querySelectorAll?.('mark').forEach(nested => {
            const parent = nested.parentNode;
            while (nested.firstChild) {
              parent.insertBefore(nested.firstChild, nested);
            }
            parent.removeChild(nested);
          });
          mark.appendChild(fragment);
          range.insertNode(mark);
        }
      }
    }

    // Serialize new content and update card
    const updatedContent = serializeContainerToContent(container);
    onUpdateCard(pageIndex, cardId, { content: updatedContent });

    setToolbarVisible(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleToggleBold = () => {
    if (!currentSelection) return;
    const { range, container, cardId, pageIndex } = currentSelection;

    const existingBold = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer.closest('b, strong')
      : range.commonAncestorContainer.parentElement?.closest('b, strong');

    if (existingBold) {
      const parent = existingBold.parentNode;
      while (existingBold.firstChild) {
        parent.insertBefore(existingBold.firstChild, existingBold);
      }
      parent.removeChild(existingBold);
    } else {
      const bTag = document.createElement('b');
      try {
        range.surroundContents(bTag);
      } catch {
        const fragment = range.extractContents();
        bTag.appendChild(fragment);
        range.insertNode(bTag);
      }
    }

    const updatedContent = serializeContainerToContent(container);
    onUpdateCard(pageIndex, cardId, { content: updatedContent });

    setToolbarVisible(false);
    window.getSelection()?.removeAllRanges();
  };

  if (!toolbarVisible) return null;

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999
      }}
      className="no-print bg-neutral-900/95 text-white backdrop-blur-md border border-neutral-700/80 rounded-full px-2.5 py-1.5 shadow-2xl shadow-black/40 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      {/* Icon Indicator */}
      <div 
        className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-amber-300 shrink-0"
        title="เครื่องมือไฮไลท์ข้อความ"
      >
        <Highlighter className="w-3 h-3" />
      </div>

      <div className="h-4 w-px bg-neutral-700 mx-0.5"></div>

      {/* Preset Color Swatches */}
      <div className="flex items-center gap-1">
        {HIGHLIGHT_COLORS.map(c => (
          <button
            key={c.id}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleApplyColor(c.hex);
            }}
            title={c.name}
            style={{ backgroundColor: c.hex, borderColor: c.border }}
            className="w-5 h-5 rounded-full border hover:scale-120 active:scale-95 transition-transform cursor-pointer shadow-xs"
          />
        ))}
      </div>

      {/* Custom Color Picker Swatch */}
      <label 
        title="กำหนดสีไฮไลท์เองตามใจชอบ"
        className="relative w-5 h-5 rounded-full border border-neutral-500/80 flex items-center justify-center cursor-pointer hover:scale-120 transition-transform overflow-hidden shadow-xs"
        style={{ backgroundColor: customColor }}
      >
        <Palette className="w-2.5 h-2.5 text-neutral-800 drop-shadow-xs" />
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            handleApplyColor(e.target.value);
          }}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
      </label>

      <div className="h-4 w-px bg-neutral-700 mx-0.5"></div>

      {/* Bold Toggle Button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleToggleBold();
        }}
        title="ทำเป็นตัวหนา (Bold)"
        className="w-5 h-5 rounded-full hover:bg-neutral-800 text-neutral-200 hover:text-white transition flex items-center justify-center"
      >
        <Bold className="w-3 h-3" />
      </button>

      {/* Clear Highlight (Eraser) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleApplyColor('clear');
        }}
        title="ลบสีไฮไลท์ข้อความนี้"
        className="w-5 h-5 rounded-full hover:bg-rose-950/80 text-rose-300 hover:text-rose-100 transition flex items-center justify-center"
      >
        <Eraser className="w-3 h-3" />
      </button>

      {/* Close button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setToolbarVisible(false);
        }}
        title="ปิดแถบเครื่องมือ"
        className="w-4 h-4 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition flex items-center justify-center ml-0.5"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
