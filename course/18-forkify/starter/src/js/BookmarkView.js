import icons from 'url:../img/icons.svg';
import View from "./View";

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateHtml() {
    const id = window.location.hash.slice(1);

    if (this._data.length === 0) {
      return `
        <div class="message">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-smile"></use>
            </svg>
          </div>
          <p>
            No bookmarks yet. Find a nice recipe and bookmark it :)
          </p>
        </div>
      `;
    }

    return `
      ${this._data.map((recipe) => {
        return `
          <li class="preview">
            <a class="preview__link ${recipe.id === id ? 'preview__link--active' : ''}" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__name">
                  ${recipe.title}
                </h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                ${recipe.key ? `
                    <div class="preview__user-generated">
                      <svg>
                        <use href="${icons}#icon-user"></use>
                      </svg>
                    </div>
                  ` : ''}
              </div>
            </a>
          </li>
        `
      }).join('')}
    `
  }
}

export default new BookmarkView();