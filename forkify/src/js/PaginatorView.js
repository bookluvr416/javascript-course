import icons from 'url:../img/icons.svg';

import View from "./View";
import { RESULTS_PER_PAGE } from './config';

class PaginatorView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerChangePage(fn) {
    this._parentElement.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      fn(parseInt(btn.dataset.goto));
    });
  }

  _generateHtml() {
    const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
    const currentPage = this._data.page;
    
    if (currentPage === 1 && numPages === 1) {
      return ``;
    }
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    if (currentPage === numPages) {
      return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    if (currentPage > 1 && currentPage < numPages) {
      return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // page 1, more pages
    // page 1, no more pages
    // last page
    // middle pages
 
  }
}

export default new PaginatorView();