import icons from 'url:../img/icons.svg';
import View from './View';

class RecipeSearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errMessage = 'No recipes found for your query. Please try again!';
  _successMessage = '';

  _generateHtml() {
    if (this._data.length === 0) {
      return '';
    }

    const id = window.location.hash.slice(1);

    return `
      <ul class="results">
        ${this._data.map((recipe) => {
          return `
            <li class="preview">
              <a class="preview__link ${id === recipe.id ? 'preview__link--active' : ''}" href="#${recipe.id}">
                <figure class="preview__fig">
                  <img src="${recipe.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${recipe.title}</h4>
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
      </ul>`
  }
}

export default new RecipeSearchResultsView();
