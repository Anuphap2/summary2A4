import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  FileDown, 
  ZoomIn, 
  ZoomOut, 
  Type
} from 'lucide-react';
import { FONT_SIZES } from '../data/defaultData';

export default function Navbar({
  fontSizeId,
  setFontSizeId,
  orientation,
  onChangeOrientation,
  zoomLevel,
  setZoomLevel,
  viewMode,
  setViewMode,
  onOpenImporter,
  onSaveContent,
  onResetDefault,
  onExportJson,
  onImportJson,
  onExportMarkdown
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="no-print sticky top-3 z-40 max-w-[1240px] mx-auto px-4 mb-6">
      <div className="bg-white/95 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-2.5 px-4 shadow-lg shadow-neutral-900/5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Mode info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            A4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900 tracking-tight">
                A4 Summary & CheatSheet Studio
              </span>
              <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded-full font-semibold">
                หน้า-หลัง
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              สร้างใบสรุปสอบ A4 สวยคมชัด ออกแบบตาม Figma Design System
            </p>
          </div>
        </div>

        {/* Central Action: Star feature "ยัดข้อความดิบ & แบ่งท่อน" */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImporter}
            className="group relative px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>ยัดข้อความดิบ & แบ่งท่อน</span>
            <span className="bg-neutral-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono text-neutral-300">
              Auto Split
            </span>
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Orientation Toggle (แนวตั้ง / แนวนอน) */}
          <div className="flex items-center bg-neutral-100/90 border border-neutral-200 rounded-full p-0.5">
            <button
              onClick={() => onChangeOrientation('portrait')}
              title="กระดาษ A4 แนวตั้ง (210 x 297 mm)"
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1.5 ${
                orientation === 'portrait' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span className="w-2.5 h-3.5 border border-current rounded-xs inline-block"></span>
              <span>แนวตั้ง</span>
            </button>
            <button
              onClick={() => onChangeOrientation('landscape')}
              title="กระดาษ A4 แนวนอน (297 x 210 mm)"
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1.5 ${
                orientation === 'landscape' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span className="w-3.5 h-2.5 border border-current rounded-xs inline-block"></span>
              <span>แนวนอน</span>
            </button>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-100/90 border border-neutral-200 rounded-full px-2.5 py-1">
            <Type className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={fontSizeId}
              onChange={(e) => setFontSizeId(e.target.value)}
              className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer text-xs"
            >
              {FONT_SIZES.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode (Side-by-Side vs Stacked) */}
          <div className="flex items-center bg-neutral-100/90 border border-neutral-200 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('stacked')}
              title="มุมมองเรียงเดี่ยว (เลื่อนลง)"
              className={`px-2 py-1 rounded-full text-[11px] font-medium transition ${
                viewMode === 'stacked' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              แนวตั้ง
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              title="มุมมองเทียบข้างหน้า-หลัง (Side-by-Side)"
              className={`px-2 py-1 rounded-full text-[11px] font-medium transition ${
                viewMode === 'side-by-side' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              คู่หน้า-หลัง
            </button>
          </div>

          {/* Zoom Level */}
          <div className="flex items-center gap-1 bg-neutral-100/90 border border-neutral-200 rounded-full px-2 py-1">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
              title="ย่อขนาดพรีวิว"
              className="text-neutral-500 hover:text-neutral-900 p-0.5"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono font-semibold text-neutral-700 w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              title="ขยายขนาดพรีวิว"
              className="text-neutral-500 hover:text-neutral-900 p-0.5"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSaveContent}
            title="บันทึกข้อมูลลงเครื่องเบราว์เซอร์"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>เซฟ</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            onClick={() => window.print()}
            title="สั่งพิมพ์หรือบันทึกเป็น PDF ขนาด A4 เป๊ะ"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-full font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ / PDF</span>
          </button>

          {/* More Options / Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="เมนูนำออกและเครื่องมือเพิ่มเติม"
              className="p-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-600 transition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded-xl p-1.5 shadow-xl w-52 z-50 text-xs animate-in fade-in zoom-in-95">
                <button
                  onClick={() => { onExportJson(); setShowExportMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 flex items-center gap-2 text-neutral-800"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>สำรองไฟล์ (JSON)</span>
                </button>

                <label className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 flex items-center gap-2 text-neutral-800 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  <span>กู้คืนไฟล์ (Import JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => { onImportJson(e); setShowExportMenu(false); }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => { onExportMarkdown(); setShowExportMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 flex items-center gap-2 text-neutral-800"
                >
                  <FileDown className="w-3.5 h-3.5 text-neutral-500" />
                  <span>บันทึกเป็น Markdown (.md)</span>
                </button>

                <div className="border-t border-neutral-100 my-1"></div>

                <button
                  onClick={() => { onResetDefault(); setShowExportMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตกลับเป็นตัวอย่างเดิม</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
