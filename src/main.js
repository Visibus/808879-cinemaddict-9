import Search from "./components/search";
import Profile from "./components/profile";
import {MIN_LENGTH_SEARCH_STRING, render, removeElement, unrender} from "./components/utils";
import PageController from "./controllers/page-controller";
import SearchController from "./controllers/search-controller";
import StatisticsController from "./controllers/statistics-controller";
import ModelFilm from "./api/model-film";
import API from "./api/api";
import {END_POINT, AUTHORIZATION} from "./components/utils";
import Loading from "./components/loading";

const onDataChange = (update) => {
  api.updateCard({
    id: update.id,
    card: ModelFilm.toRAW(update),
  })
    .then(() => {
      api.getCards()
        .then((updatedCards) => {
          init(updatedCards);
        });
    });
};

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics p`);
const search = new Search();
render(headerElement, search.getElement());
const loading = new Loading();

const init = (cards) => {

  unrender(loading.getElement());
  loading.removeElement();

  const profile = new Profile(cards);
  removeElement(headerElement.querySelector(`.profile`));
  render(headerElement, profile.getElement());
  mainElement.innerHTML = ``;
  const statisticsController = new StatisticsController(mainElement, cards, onDataChange);
  const searchController = new SearchController(mainElement, search, cards, onDataChange);
  const pageController = new PageController(mainElement, cards, searchController, statisticsController, onDataChange);
  searchController.init();
  pageController.init();
  statisticsController.init();
  statisticsElement.textContent = `${cards.length} movies inside`;

  let querySearch = ``;
  search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
    if (querySearch !== evt.target.value) {
      if (evt.target.value.length >= MIN_LENGTH_SEARCH_STRING) {
        searchController.show();
        pageController.hide();
      } else {
        searchController.hide();
        pageController.show();
      }
      querySearch = evt.target.value;
    }
  });

  search.getElement().querySelector(`.search__reset`).addEventListener(`click`, () => {
    searchController.hide();
    pageController.show();
  });


};

render(mainElement, loading.getElement());
api.getCards().then((cards) => init(cards));


