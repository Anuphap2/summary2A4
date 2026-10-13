export function removePage(pages, pageId) {
  if (pages.length <= 1 || !pages.some(page => page.id === pageId)) return pages;

  return pages
    .filter(page => page.id !== pageId)
    .map((page, index) => ({ ...page, pageNumber: index + 1 }));
}
