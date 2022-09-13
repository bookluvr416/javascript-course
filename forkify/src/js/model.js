import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config";
import { getJson, sendJson } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  bookmarks: [],
  resultsPerPage: RESULTS_PER_PAGE,
};

export const loadRecipe = async (id) => {
  try {
    const data = await getJson(`${API_URL}/${id}`);

    state.recipe = {
      id: data.data.recipe.id,
      title: data.data.recipe.title,
      publisher: data.data.recipe.publisher,
      sourceUrl: data.data.recipe.source_url,
      image: data.data.recipe.image_url,
      servings: data.data.recipe.servings,
      cookingTime: data.data.recipe.cooking_time,
      ingredients: data.data.recipe.ingredients,
      bookmarked: state.bookmarks.some((bookmark) => bookmark.id === data.data.recipe.id),
      key: data.data.recipe.key ? data.data.recipe.key : null,
    };
  } catch (e) {
    throw e;
  }
};

export const searchRecipes = async (searchText) => {
  try {
    const data = await getJson(`${API_URL}?search=${searchText}&key=${API_KEY}`);
    const recipes = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        key: recipe.key ? recipe.key : null,
      }
    });
    state.search = {
      query: searchText,
      results: recipes,
      page: 1,
    };
  } catch (e) {
    throw e;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const begin = (page - 1) * state.resultsPerPage;
  const end = page * state.resultsPerPage;
  return state.search.results.slice(begin, end);
};

export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('forkify-bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = (id) => {
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

export const getStoredBookmarks = () => {
  const bookmarks = localStorage.getItem('forkify-bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
}

export const uploadRecipe = async (newRecipe) => {
  const ingredients = Object.entries(newRecipe)
    .filter((entry, i) => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map((ingredient) => {
      const ingredientArray = ingredient[1].split(',').map((el) => el.trim());

      if (ingredientArray.length !== 3) throw new Error('Invalid number of ingredients, please try again.');

      const [quantity, unit, description] = ingredientArray;
      const convertedQuantity = quantity ? Number(quantity) : null
      return {
        quantity: !isNaN(convertedQuantity) ? convertedQuantity : null,
        unit,
        description,
      }
    });
  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    servings: +newRecipe.servings,
    cooking_time: +newRecipe.cookingTime,
    ingredients
  };

  try {
    const data = await sendJson(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = {
      id: data.data.recipe.id,
      title: data.data.recipe.title,
      publisher: data.data.recipe.publisher,
      sourceUrl: data.data.recipe.source_url,
      image: data.data.recipe.image_url,
      servings: data.data.recipe.servings,
      cookingTime: data.data.recipe.cooking_time,
      ingredients: data.data.recipe.ingredients,
      key: data.data.recipe.key,
    };
    addBookmark(state.recipe);
  } catch (err) {
    throw new Error('Unable to upload recipe, please try again.')
  }
};
