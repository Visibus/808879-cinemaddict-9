import {Search} from './components/search.js';
import {Profile} from './components/profile.js';
import {Menu} from './components/menu.js';
import {filmCards, getFilmsAmount} from './components/data';
import {MIN_LENGTH_SEARCH_STRING, render, getRandNumber, removeElement} from "./components/utils";
import {PageController} from './controllers/page-controller';
import {SearchController} from './controllers/search-controller';
import {Statistics} from './components/statistics';

const onDataChange = (cards) => {
  filmCards = cards;
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const search = new Search();
const profile = new Profile(getRandNumber(getFilmsAmount()));
const menu = new Menu(filmCards);
const statistics = new Statistics();

const statisticsElement = document.querySelector(`.footer__statistics p`);

render(headerElement, search.getElement());
render(headerElement, profile.getElement());
render(mainElement, menu.getElement());

const searchController = new SearchController(mainElement, search, filmCards, onDataChange);
const pageController = new PageController(mainElement, filmCards);
searchController.init();
pageController.init();
pageController.show(filmCards);

menu.getElement().addEventListener(`click`, (evt) => {
  if (evt.target.tagName !== `A`) {
    return;
  }

  evt.preventDefault();
  const activeClass = `main-navigation__item--active`;
  const activeLinkElement = menu.getElement().querySelector(`.${activeClass}`);
  activeLinkElement.classList.remove(activeClass);
  evt.target.classList.add(activeClass);

  switch (evt.target.dataset.screen) {
    case `all`:
      pageController.show(filmCards);
      searchController.hide();
      removeElement(statistics.getElement());
      statistics.removeElement();
      break;
    case `stats`:
      pageController.hide();
      searchController.hide();
      render(mainElement, statistics.getElement());
      break;
  }
});

search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
  if (evt.target.value.length >= MIN_LENGTH_SEARCH_STRING) {
    searchController.show();
    pageController.hide();
  } else {
    searchController.hide();
    pageController.show(filmCards);
  }
});

search.getElement().querySelector(`.search__reset`).addEventListener(`click`, () => {
  searchController.hide();
  pageController.show(filmCards);
});

statisticsElement.textContent = `${getFilmsAmount()} movies inside`;


