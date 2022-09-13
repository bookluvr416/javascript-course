import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './RecipeView';
import recipeSearchView from './RecipeSearchView';
import recipeSearchResultsView from './RecipeSearchResultsView';
import paginatorView from './PaginatorView';
import bookmarkView from './BookmarkView';
import addRecipeView from './AddRecipeView';
import { RECIPE_MODAL_CLOSE_TIMEOUT_SEC } from './config';

// https://forkify-api.herokuapp.com/v2


const controlRecipe = async () => {
  const id = window.location.hash.slice(1);
  if (!id) return;

  recipeSearchResultsView.updateDom(model.getSearchResultsPage());

  try {
    recipeView.showSpinner();
    await model.loadRecipe(id);
  } catch (e) {
    recipeView.showError();
    return;
  }
  
  recipeView.render(model.state.recipe);
  bookmarkView.updateDom(model.state.bookmarks);
};

const controlSearchResults = async () => {
  try {
    const searchText = recipeSearchView.getQuery();
    if (!searchText) return;

    recipeSearchResultsView.showSpinner();
    await model.searchRecipes(searchText);
    recipeSearchView.clearInput();
    recipeSearchResultsView.render(model.getSearchResultsPage());
    paginatorView.render(model.state.search);
  } catch (e) {
    recipeSearchResultsView.showError();
    return;
  }
};

const controlPaginator = (goToPage) => {
  recipeSearchResultsView.render(model.getSearchResultsPage(goToPage));
  paginatorView.render(model.state.search);
  controlServings();
};

const controlServings = (newServings) => {
  model.updateServings(newServings);
  recipeView.updateDom(model.state.recipe);
}

const controlAddBookmark = () => {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  recipeView.updateDom(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
}

const controlUpload = async (newRecipe) => {
  try {
    addRecipeView.showSpinner();

    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    addRecipeView.showSuccess();
    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => { addRecipeView.toggleWindow(); }, RECIPE_MODAL_CLOSE_TIMEOUT_SEC * 1000)
  } catch (err) {
    addRecipeView.showError(err.message);
  }
}

const init = () => {
  recipeView.addHandlerRenderer(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeSearchView.addHandlerSearch(controlSearchResults);
  paginatorView.addHandlerChangePage(controlPaginator);
  addRecipeView.addHandlerUpload(controlUpload);

  model.getStoredBookmarks();
  bookmarkView.render(model.state.bookmarks);
};
init();
