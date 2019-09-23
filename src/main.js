import {Search} from './components/search.js';
import {Profile} from './components/profile.js';
import {getFilmsAmount, getFilmCard} from './components/data';
import {MIN_LENGTH_SEARCH_STRING, render} from "./components/utils";
import {PageController} from './controllers/page-controller';
import {SearchController} from './controllers/search-controller';
import {StatisticsController} from "./controllers/statistics-controller";

let filmCardsSav = Array.from({length: getFilmsAmount()}, getFilmCard);
const onDataChange = (cards) => {
  filmCardsSav = cards;
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const search = new Search();
const profile = new Profile(filmCardsSav);
// const menu = new Menu(filmCardsSav);

const statisticsElement = document.querySelector(`.footer__statistics p`);

render(headerElement, search.getElement());
render(headerElement, profile.getElement());

const statisticsController = new StatisticsController(mainElement, filmCardsSav, onDataChange);
const searchController = new SearchController(mainElement, search, filmCardsSav, onDataChange);
const pageController = new PageController(mainElement, filmCardsSav, searchController, statisticsController, onDataChange);
searchController.init();
pageController.init();
statisticsController.init();

search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
  if (evt.target.value.length >= MIN_LENGTH_SEARCH_STRING) {
    searchController.show();
    pageController.hide();
  } else {
    searchController.hide();
    pageController.show();
  }
});

search.getElement().querySelector(`.search__reset`).addEventListener(`click`, () => {
  searchController.hide();
  pageController.show();
});

statisticsElement.textContent = `${getFilmsAmount()} movies inside`;


