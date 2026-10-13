import { 
  compactContentWithPipeAndColor, 
  normalizeHighlightTags,
  autoHighlightText
} from './promptGenerator.js';

/**
 * Robust Smart Chunk Parser for A4 Cheat Sheets
 * Parses raw text or AI output into structured card chunks.
 * Guarantees no empty cards or orphan page markers.
 */
export const parseRawTextToChunks = (rawText, {
  delimiter = '---',
  autoCompactPipe = true,
  autoFormula = true,
  autoBoldKeys = true,
  autoHighlight = true
} = {}) => {
  if (!rawText || !rawText.trim()) return [];

  const delim = delimiter.trim() || '---';
  const initialParts = rawText.split(delim);
  const rawParts = [];

  // Ensure headers stuck to text or multiple headers in one chunk are cleanly separated
  initialParts.forEach((p) => {
    const trimmedP = p.trim();
    if (!trimmedP) return;
    const normalized = trimmedP.replace(/([^\n\s])(#{2,4}\s+[0-9A-Za-zก-๙])/g, '$1\n$2');
    const subParts = normalized.split(/(?=(?:^|\n)#{2,4}\s+[0-9A-Za-zก-๙])/);
    subParts.forEach(sp => {
      const cleanSp = sp.trim();
      if (cleanSp) rawParts.push(cleanSp);
    });
  });

  let currentPage = 1;
  const sections = [];
  const colors = ['lilac', 'lime', 'coral', 'mint', 'cream', 'pink', 'sky'];

  rawParts.forEach((part) => {
    let raw = part.trim();
    if (!raw) return;

    // Detect page header marker e.g. === หน้า 1 === or === หน้า 2 (หุ่นยนต์...) === or # หน้า 1 or [หน้า 1]
    const pageHeaderMatch = raw.match(/(?:^|\n)\s*(?:={2,}|#{1,4}|-{2,}|\[)?\s*(?:หน้า\s*([1-9])|Page\s*([1-9])|ด้านหน้า|ด้านหลัง)[^\n]*(?:={2,}|#{1,4}|-{2,}|\])?\s*(?:\n|$)/i);
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
    const contentLines = [];
    let isTitleFound = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check for inner page header line that might appear inside a chunk
      const innerPageMatch = trimmedLine.match(/^(?:={2,}|#{1,4}|-{2,}|\[)?\s*(?:หน้า\s*([1-9])|Page\s*([1-9])|ด้านหน้า|ด้านหลัง)[^\n]*(?:={2,}|#{1,4}|-{2,}|\])?$/i);
      if (innerPageMatch) {
        const matchedPageNum = innerPageMatch[1] || innerPageMatch[2];
        if (matchedPageNum) {
          currentPage = Number(matchedPageNum);
        } else if (innerPageMatch[0].includes('ด้านหน้า')) {
          currentPage = 1;
        } else if (innerPageMatch[0].includes('ด้านหลัง')) {
          currentPage = 2;
        }
        continue;
      }

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

    // Prevent empty box bug: if there are no content lines, skip!
    if (!body) {
      return;
    }

    // Fallbacks if title is empty
    if (!title) {
      const firstLine = body.split('\n')[0].trim();
      if (firstLine.length <= 40) {
        title = firstLine;
        body = body.split('\n').slice(1).join('\n').trim();
      } else {
        title = `กล่องที่ ${sections.length + 1}`;
      }
    }

    // Double check body has content after title extraction
    if (!body) {
      return;
    }

    if (!tag) {
      tag = `หน้า ${currentPage} • กล่องที่ ${sections.length + 1}`;
    }

    // Post-process formatting
    if (autoCompactPipe) {
      body = compactContentWithPipeAndColor(body);
    }

    if (autoBoldKeys) {
      body = body.replace(/^([A-Za-z0-9ก-๙\s]{2,25}):\s*/gm, '<b>$1:</b> ');
    }

    if (autoFormula) {
      // Normalize LaTeX block delimiters
      body = body.replace(/\$\$([\s\S]*?)\$\$/g, ' [formula]$1[/formula] ');
      body = body.replace(/\\\[([\s\S]*?)\\\]/g, ' [formula]$1[/formula] ');

      // Wrap standalone formula lines if not already wrapped
      body = body.replace(/^((?:(?:\\text\{[^}]+\}|[a-zA-Z\d_\\]+)\s*(?:=|\\ge|\\le|≥|≤)\s*[^;\n]+|d\s*=\s*√[^;\n]+|(?:\\sigma|\\alpha|\\beta|f)\([^)]+\)\s*=\s*[^;\n]+))\s*$/gm, (match) => {
        const trimmed = match.trim();
        if (trimmed.startsWith('[formula]') || trimmed.endsWith('[/formula]')) return match;
        return `[formula]${trimmed}[/formula]`;
      });
    }

    // Automatic intelligent highlight if enabled and no highlights exist
    if (autoHighlight) {
      body = autoHighlightText(body);
    }

    // Normalize any highlight syntax from AI (==text==, [hl=color], [hl], <mark>)
    body = normalizeHighlightTags(body);

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
};
