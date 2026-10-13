import React, { useRef, useEffect, useState } from 'react';
import CardItem from './CardItem';
import { Plus, AlertTriangle, CheckCircle2, Columns2, Columns3, LayoutList, Trash2 } from 'lucide-react';

export default function A4Page({ 
  page, 
  pageIndex, 
  totalPages, 
  fontSizeConfig, 
  lineHeightConfig,
  orientation = 'portrait',
  onUpdatePage, 
  onDeletePage,
  onAddCard, 
  onUpdateCard, 
  onDeleteCard, 
  onDuplicateCard, 
  onMoveCard, 
  onTransferPage,
  onSplitCard,
  onAutoMoveOverflow,
  draggedCardInfo,
  setDraggedCardInfo
}) {
  const pageRef = useRef(null);
  const a4MarkerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowPx, setOverflowPx] = useState(0);
  const [dragOverInfo, setDragOverInfo] = useState(null); // { cardIndex: number, position: 'before' | 'after' }
  const [isDragOverEnd, setIsDragOverEnd] = useState(false);

  const isLandscape = orientation === 'landscape';
  const layoutMode = page.layoutMode || 'masonry';
  const cols = page.columns || 4;

  // Monitor height against A4 standard (Portrait 297mm ≈ 1122px, Landscape 210mm ≈ 793px)
  useEffect(() => {
    const checkHeight = () => {
      if (pageRef.current && a4MarkerRef.current) {
        const height = pageRef.current.scrollHeight;
        const maxStandardHeight = a4MarkerRef.current.offsetHeight;
        const diff = height - maxStandardHeight;
        if (diff > 4) {
          setIsOverflowing(true);
          setOverflowPx(Math.round(diff));
        } else {
          setIsOverflowing(false);
          setOverflowPx(0);
        }
      }
    };

    checkHeight();
    const timer = setTimeout(checkHeight, 250);
    return () => clearTimeout(timer);
  }, [page.cards, fontSizeConfig, lineHeightConfig, page.columns, orientation, page.layoutMode]);

  // Drag handlers
  const handleDragStart = (e, cardId, pIdx, cIdx) => {
    setDraggedCardInfo({ cardId, fromPageIndex: pIdx, fromCardIndex: cIdx });
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOverCard = (e, cIdx) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const isAfter = (e.clientY - rect.top) > (rect.height / 2);
    setDragOverInfo({ cardIndex: cIdx, position: isAfter ? 'after' : 'before' });
    setIsDragOverEnd(false);
  };

  const handleDropOnCard = (e, targetCardIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCardInfo) return;

    const { fromPageIndex, fromCardIndex, cardId } = draggedCardInfo;
    const position = dragOverInfo?.position || 'before';

    if (fromPageIndex === pageIndex) {
      // Reordering within the same page
      if (position === 'after') {
        const dest = fromCardIndex < targetCardIndex ? targetCardIndex : targetCardIndex + 1;
        onMoveCard(pageIndex, fromCardIndex, dest);
      } else {
        const dest = fromCardIndex < targetCardIndex ? targetCardIndex - 1 : targetCardIndex;
        onMoveCard(pageIndex, fromCardIndex, dest);
      }
    } else {
      // Transfer across pages
      const dest = position === 'after' ? targetCardIndex + 1 : targetCardIndex;
      onTransferPage(cardId, pageIndex, dest);
    }

    setDragOverInfo(null);
    setIsDragOverEnd(false);
    setDraggedCardInfo(null);
  };

  const handleDragOverEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOverEnd(true);
    setDragOverInfo(null);
  };

  const handlePageDropAtEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCardInfo) return;
    const { fromPageIndex, fromCardIndex, cardId } = draggedCardInfo;
    
    if (fromPageIndex === pageIndex) {
      // Reordering to the end of the same page
      if (fromCardIndex !== page.cards.length - 1) {
        onMoveCard(pageIndex, fromCardIndex, page.cards.length - 1);
      }
    } else {
      // Transfer from another page to the end of this page
      onTransferPage(cardId, pageIndex, page.cards.length);
    }
    setDragOverInfo(null);
    setIsDragOverEnd(false);
    setDraggedCardInfo(null);
  };

  const gridColsClass = 
    cols === 4 ? 'grid-cols-4' : 
    cols === 3 ? 'grid-cols-3' : 
    cols === 1 ? 'grid-cols-1' : 
    'grid-cols-2';

  const masonryColsClass = 
    cols === 4 ? 'a4-cols-4' : 
    cols === 3 ? 'a4-cols-3' : 
    cols === 1 ? 'a4-cols-1' : 
    'a4-cols-2';

  return (
    <div className="flex flex-col items-center mb-8 relative">
      
      {/* Top Page Label & Warning Indicator (no-print) */}
      <div className={`no-print w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-[210mm]'} flex items-center justify-between px-2 mb-2 text-xs flex-wrap gap-2`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-800 text-sm">
            📄 หน้า {page.pageNumber} {page.pageNumber === 1 ? '(ด้านหน้า)' : page.pageNumber === 2 ? '(ด้านหลัง)' : ''}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {page.cards.length} กล่องสรุป
          </span>
          {onDeletePage && (
            <button
              type="button"
              disabled={totalPages <= 1}
              onClick={() => onDeletePage(page.id)}
              title={totalPages <= 1 ? 'ต้องเหลือหน้ากระดาษอย่างน้อย 1 หน้า' : 'ลบหน้ากระดาษ A4 นี้'}
              aria-label={`ลบหน้า ${page.pageNumber}`}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Trash2 className="w-3 h-3" />
              <span>ลบหน้า</span>
            </button>
          )}
          <span className="text-[10px] bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
            {isLandscape ? 'แนวนอน' : 'แนวตั้ง'}
          </span>
        </div>

        {/* Height Overflow Badge & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isOverflowing ? (
            <div className="flex items-center gap-1.5">
              <div 
                title={`ความสูงเกินขนาดกระดาษ ${isLandscape ? '210mm' : '297mm'} แนะนำให้ย้ายบางการ์ดไปอีกหน้า หรือตัดแบ่งกล่อง เพื่อไม่ให้ตัดบรรทัดเมื่อพิมพ์`}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>ล้นหน้า (+{overflowPx}px)</span>
              </div>
              {onAutoMoveOverflow && (
                <button
                  type="button"
                  onClick={() => onAutoMoveOverflow(pageIndex)}
                  title="ย้ายกล่องท้ายสุดไปยังหน้าถัดไป เพื่อให้หน้ากระดาษพอดี 1 แผ่น"
                  className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <span>ย้ายกล่องล้นไปหน้าถัดไป</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ความสูงพอดีแผ่น A4 (100% Fit)</span>
            </div>
          )}

          {/* Layout Mode Selector */}
          <div className="flex items-center gap-0.5 bg-neutral-200/80 p-0.5 rounded-lg border border-neutral-300">
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { layoutMode: 'cheatsheet' })}
              title="ชีทต่อเนื่อง: เรียงเนื้อหาเป็นคอลัมน์และประหยัดพื้นที่กระดาษ"
              aria-pressed={layoutMode === 'cheatsheet'}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                layoutMode === 'cheatsheet'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ชีทต่อเนื่อง
            </button>
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { layoutMode: 'masonry' })}
              title="Masonry: กล่องยาวตามจริง ไม่ยืดความสูง ไม่กินพื้นที่ส่วนอื่น (แนะนำ)"
              aria-pressed={layoutMode === 'masonry'}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                layoutMode === 'masonry'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Masonry (ไม่กินที่)
            </button>
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { layoutMode: 'grid' })}
              title="Grid: จัดแถวความสูงตารางตรงกัน"
              aria-pressed={layoutMode === 'grid'}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                layoutMode === 'grid'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Grid (ตารางแถว)
            </button>
          </div>

          {/* Column Layout Selector */}
          <div className="flex items-center gap-0.5 bg-neutral-200/80 p-0.5 rounded-lg border border-neutral-300">
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { columns: 1 })}
              title="1 คอลัมน์"
              className={`p-1 rounded cursor-pointer ${cols === 1 ? 'bg-white shadow-xs text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { columns: 2 })}
              title="2 คอลัมน์ (แนะนำสำหรับแนวตั้ง)"
              className={`p-1 rounded cursor-pointer ${cols === 2 ? 'bg-white shadow-xs text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { columns: 3 })}
              title="3 คอลัมน์ (อัดแน่น / แนะนำสำหรับแนวนอน)"
              className={`p-1 rounded cursor-pointer ${cols === 3 ? 'bg-white shadow-xs text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdatePage(page.id, { columns: 4 })}
              title="4 คอลัมน์ (อัดแน่นพิเศษสำหรับแนวนอน)"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${cols === 4 ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              4 คอลัมน์
            </button>
          </div>
        </div>
      </div>

      {/* Physical A4 Canvas */}
      <div 
        ref={pageRef}
        onDragOver={handleDragOverEnd}
        onDrop={handlePageDropAtEnd}
        style={{
          '--a4-line-height': lineHeightConfig?.value || '1.48',
          '--a4-line-gap': lineHeightConfig?.lineGap || '2.5px'
        }}
        className={`a4-page-container ${isLandscape ? 'landscape' : ''} ${layoutMode === 'cheatsheet' ? 'cheatsheet-mode' : ''} ${fontSizeConfig.class}`}
      >
        {/* Invisible Height Calibration Marker */}
        <div 
          ref={a4MarkerRef}
          className="absolute left-0 top-0 pointer-events-none opacity-0 select-none w-0"
          style={{ height: isLandscape ? '210mm' : '297mm' }}
        />

        {/* Overflow Cutoff Guide Line (Shows exactly where A4 print page boundary is) */}
        {isOverflowing && (
          <div 
            className="no-print absolute left-0 right-0 border-b-2 border-dashed border-rose-500 pointer-events-none z-30 flex items-center justify-between px-3"
            style={{ top: isLandscape ? '210mm' : '297mm' }}
          >
            <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              ⚠️ ขอบแผ่น A4 ({isLandscape ? '210mm' : '297mm'}) — เนื้อหาด้านล่างนี้จะถูกตัด/ล้นเมื่อพิมพ์ (เกิน {overflowPx}px)
            </span>
            <span className="bg-white/95 text-rose-700 font-bold text-[8.5px] px-2 py-0.5 rounded border border-rose-200 shadow-sm">
              แนะนำกดปุ่ม "ย้ายกล่องล้นไปหน้าถัดไป" ด้านบน
            </span>
          </div>
        )}

        {/* A4 Page Header Bar */}
        <div 
          className="a4-page-header border-b-2 pb-1 mb-2 flex justify-between items-end"
          style={{ borderColor: page.accentColor || '#111827' }}
        >
          <div className="flex-1 mr-2">
            <input
              type="text"
              value={page.title}
              onChange={(e) => onUpdatePage(page.id, { title: e.target.value })}
              className="font-extrabold text-[12px] leading-tight text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none w-full"
            />
            <input
              type="text"
              value={page.subtitle}
              onChange={(e) => onUpdatePage(page.id, { subtitle: e.target.value })}
              className="text-[8px] text-neutral-500 mt-0.5 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none w-full"
            />
          </div>

          <span 
            className="text-[8.5px] font-bold text-white px-2 py-0.5 rounded shrink-0 shadow-xs"
            style={{ backgroundColor: page.accentColor || '#111827' }}
          >
            หน้า {page.pageNumber} / {totalPages}
          </span>
        </div>

        {/* Cards Layout: Masonry Flow (Default) or Grid */}
        {layoutMode === 'cheatsheet' ? (
          <div 
            className={`${masonryColsClass} a4-cheatsheet-flow pb-0`}
            onDragOver={handleDragOverEnd}
            onDrop={handlePageDropAtEnd}
          >
            {page.cards.map((card, cIdx) => (
              <div
                key={card.id}
                className="cheatsheet-flow-item"
                onDragOver={(e) => handleDragOverCard(e, cIdx)}
                onDrop={(e) => handleDropOnCard(e, cIdx)}
              >
                <CardItem
                  card={card}
                  pageIndex={pageIndex}
                  cardIndex={cIdx}
                  totalCards={page.cards.length}
                  fontSizeConfig={fontSizeConfig}
                  layoutMode={layoutMode}
                  onUpdateCard={(cardId, updates) => onUpdateCard(pageIndex, cardId, updates)}
                  onDeleteCard={(cardId) => onDeleteCard(pageIndex, cardId)}
                  onDuplicateCard={(cardId) => onDuplicateCard(pageIndex, cardId)}
                  onMoveCard={(fromIdx, toIdx) => onMoveCard(pageIndex, fromIdx, toIdx)}
                  onTransferPage={onTransferPage}
                  onSplitCard={onSplitCard ? (cardId) => onSplitCard(pageIndex, cardId) : undefined}
                  isDragOver={dragOverInfo?.cardIndex === cIdx}
                  dragOverPosition={dragOverInfo?.cardIndex === cIdx ? dragOverInfo.position : null}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => handleDragOverCard(e, cIdx)}
                  onDrop={(e) => handleDropOnCard(e, cIdx)}
                />
              </div>
            ))}

            {/* Dedicated Drop Zone at End when Dragging */}
            {draggedCardInfo && (
              <div
                onDragOver={handleDragOverEnd}
                onDrop={handlePageDropAtEnd}
                className={`no-print cheatsheet-flow-item rounded-lg p-2.5 my-1 flex items-center justify-center text-center cursor-pointer border-2 border-dashed transition-all duration-150 ${
                  isDragOverEnd 
                    ? 'border-indigo-600 bg-indigo-100 text-indigo-950 scale-[1.01] shadow-md ring-2 ring-indigo-400 font-bold' 
                    : 'border-indigo-400/80 bg-indigo-50/70 text-indigo-700 hover:border-indigo-600'
                }`}
              >
                <span className="text-[9.5px] font-bold flex items-center gap-1.5">
                  <span>📥</span>
                  <span>วางที่นี่เพื่อต่อท้ายหน้า {page.pageNumber} (ลงในพื้นที่ว่าง)</span>
                </span>
              </div>
            )}

            <div
              onClick={() => onAddCard(pageIndex)}
              onDragOver={handleDragOverEnd}
              onDrop={handlePageDropAtEnd}
              className="no-print cheatsheet-flow-item border-2 border-dashed border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 rounded-lg p-2 flex flex-col items-center justify-center text-center cursor-pointer transition group min-h-[45px]"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:scale-110 transition" />
              <span className="text-[8.5px] font-bold text-neutral-500 group-hover:text-neutral-900 mt-0.5">
                + เพิ่มกล่องสรุปใหม่
              </span>
            </div>
          </div>
        ) : layoutMode === 'masonry' ? (
          <div 
            className={`${masonryColsClass} pb-6`}
            onDragOver={handleDragOverEnd}
            onDrop={handlePageDropAtEnd}
          >
            {page.cards.map((card, cIdx) => (
              <div 
                key={card.id} 
                className="a4-masonry-item"
                onDragOver={(e) => handleDragOverCard(e, cIdx)}
                onDrop={(e) => handleDropOnCard(e, cIdx)}
              >
                <CardItem
                  card={card}
                  pageIndex={pageIndex}
                  cardIndex={cIdx}
                  totalCards={page.cards.length}
                  fontSizeConfig={fontSizeConfig}
                  layoutMode={layoutMode}
                  onUpdateCard={(cardId, updates) => onUpdateCard(pageIndex, cardId, updates)}
                  onDeleteCard={(cardId) => onDeleteCard(pageIndex, cardId)}
                  onDuplicateCard={(cardId) => onDuplicateCard(pageIndex, cardId)}
                  onMoveCard={(fromIdx, toIdx) => onMoveCard(pageIndex, fromIdx, toIdx)}
                  onTransferPage={onTransferPage}
                  onSplitCard={onSplitCard ? (cardId) => onSplitCard(pageIndex, cardId) : undefined}
                  isDragOver={dragOverInfo?.cardIndex === cIdx}
                  dragOverPosition={dragOverInfo?.cardIndex === cIdx ? dragOverInfo.position : null}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => handleDragOverCard(e, cIdx)}
                  onDrop={(e) => handleDropOnCard(e, cIdx)}
                />
              </div>
            ))}

            {/* Dedicated Drop Zone at End when Dragging */}
            {draggedCardInfo && (
              <div
                onDragOver={handleDragOverEnd}
                onDrop={handlePageDropAtEnd}
                className={`no-print a4-masonry-item rounded-lg p-2.5 my-1 flex items-center justify-center text-center cursor-pointer border-2 border-dashed transition-all duration-150 ${
                  isDragOverEnd 
                    ? 'border-indigo-600 bg-indigo-100 text-indigo-950 scale-[1.01] shadow-md ring-2 ring-indigo-400 font-bold' 
                    : 'border-indigo-400/80 bg-indigo-50/70 text-indigo-700 hover:border-indigo-600'
                }`}
              >
                <span className="text-[9.5px] font-bold flex items-center gap-1.5">
                  <span>📥</span>
                  <span>วางที่นี่เพื่อต่อท้ายหน้า {page.pageNumber} (ลงในพื้นที่ว่าง)</span>
                </span>
              </div>
            )}

            {/* Quick Add Card Placeholder (No Print) */}
            <div 
              onClick={() => onAddCard(pageIndex)}
              onDragOver={handleDragOverEnd}
              onDrop={handlePageDropAtEnd}
              className="no-print a4-masonry-item border-2 border-dashed border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 rounded-lg p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition group min-h-[55px]"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:scale-110 transition" />
              <span className="text-[8.5px] font-bold text-neutral-500 group-hover:text-neutral-900 mt-0.5">
                + เพิ่มกล่องสรุปใหม่
              </span>
            </div>
          </div>
        ) : (
          <div 
            className={`grid ${gridColsClass} items-start ${fontSizeConfig.gap} h-full content-start pb-6`}
            onDragOver={handleDragOverEnd}
            onDrop={handlePageDropAtEnd}
          >
            {page.cards.map((card, cIdx) => (
              <div 
                key={card.id}
                onDragOver={(e) => handleDragOverCard(e, cIdx)}
                onDrop={(e) => handleDropOnCard(e, cIdx)}
              >
                <CardItem
                  card={card}
                  pageIndex={pageIndex}
                  cardIndex={cIdx}
                  totalCards={page.cards.length}
                  fontSizeConfig={fontSizeConfig}
                  layoutMode={layoutMode}
                  onUpdateCard={(cardId, updates) => onUpdateCard(pageIndex, cardId, updates)}
                  onDeleteCard={(cardId) => onDeleteCard(pageIndex, cardId)}
                  onDuplicateCard={(cardId) => onDuplicateCard(pageIndex, cardId)}
                  onMoveCard={(fromIdx, toIdx) => onMoveCard(pageIndex, fromIdx, toIdx)}
                  onTransferPage={onTransferPage}
                  onSplitCard={onSplitCard ? (cardId) => onSplitCard(pageIndex, cardId) : undefined}
                  isDragOver={dragOverInfo?.cardIndex === cIdx}
                  dragOverPosition={dragOverInfo?.cardIndex === cIdx ? dragOverInfo.position : null}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => handleDragOverCard(e, cIdx)}
                  onDrop={(e) => handleDropOnCard(e, cIdx)}
                />
              </div>
            ))}

            {/* Dedicated Drop Zone at End when Dragging */}
            {draggedCardInfo && (
              <div
                onDragOver={handleDragOverEnd}
                onDrop={handlePageDropAtEnd}
                className={`no-print col-span-full rounded-lg p-2.5 my-1 flex items-center justify-center text-center cursor-pointer border-2 border-dashed transition-all duration-150 ${
                  isDragOverEnd 
                    ? 'border-indigo-600 bg-indigo-100 text-indigo-950 scale-[1.01] shadow-md ring-2 ring-indigo-400 font-bold' 
                    : 'border-indigo-400/80 bg-indigo-50/70 text-indigo-700 hover:border-indigo-600'
                }`}
              >
                <span className="text-[9.5px] font-bold flex items-center gap-1.5">
                  <span>📥</span>
                  <span>วางที่นี่เพื่อต่อท้ายหน้า {page.pageNumber} (ลงในพื้นที่ว่าง)</span>
                </span>
              </div>
            )}

            {/* Quick Add Card Placeholder (No Print) */}
            <div 
              onClick={() => onAddCard(pageIndex)}
              onDragOver={handleDragOverEnd}
              onDrop={handlePageDropAtEnd}
              className="no-print border-2 border-dashed border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer transition group min-h-[70px]"
            >
              <Plus className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:scale-110 transition" />
              <span className="text-[9px] font-bold text-neutral-500 group-hover:text-neutral-900 mt-1">
                + เพิ่มกล่องสรุปใหม่
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
