import icons from 'url:../img/icons.svg';

class View {
  _data;

  render(data) {
    this._data = data;   
    const html = this._generateHtml(); 
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html); 
  };

  updateDom(data) {
    this._data = data;
    const newHtml = this._generateHtml();
    const newDom = document.createRange().createContextualFragment(newHtml);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      
      if (!newEl.isEqualNode(curEl)) {
        if (curEl.firstChild?.nodeValue.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }
        Array.from(newEl.attributes).forEach((attr) => curEl.setAttribute(attr.name, attr.value));
      }
    })
  }

  showSuccess(message = this._successMessage) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html); 
  }

  showError = (message = this._errMessage) => {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html); 
  };

  showSpinner = () => {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  };
}

export default View;
