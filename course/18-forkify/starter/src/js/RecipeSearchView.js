class RecipeSearchView {
  #parentElement = document.querySelector('.search');

  addHandlerSearch(fn) {
    this.#parentElement.querySelector('.search__btn').addEventListener('click', fn);
  }

  clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    return this.#parentElement.querySelector('.search__field').value;
  }
}

export default new RecipeSearchView();
