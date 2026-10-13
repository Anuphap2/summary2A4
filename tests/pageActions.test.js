import assert from 'node:assert/strict';
import test from 'node:test';
import { removePage } from '../src/utils/pageActions.js';

const pages = [
  { id: 'page-1', pageNumber: 1, cards: [{ id: 'card-1' }] },
  { id: 'page-2', pageNumber: 2, cards: [] },
  { id: 'page-3', pageNumber: 3, cards: [{ id: 'card-3' }] }
];

test('removes an empty page and renumbers the remaining A4 pages', () => {
  const result = removePage(pages, 'page-2');

  assert.deepEqual(result.map(page => [page.id, page.pageNumber]), [
    ['page-1', 1],
    ['page-3', 2]
  ]);
  assert.equal(result[1].cards[0].id, 'card-3');
});

test('keeps the final remaining page', () => {
  const singlePage = [pages[0]];

  assert.equal(removePage(singlePage, 'page-1'), singlePage);
});

test('leaves pages unchanged when the requested page does not exist', () => {
  assert.equal(removePage(pages, 'missing-page'), pages);
});
