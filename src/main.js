import {createSearchTemplate} from './components/search.js';
import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createCardTemplate} from './components/card.js';
import {createShowMoreTemplate} from './components/show-more.js';
import {createPopupTemplate} from './components/popup.js';
import {getFilmCard, filmCards, getFilmsAmount, filmComments} from './components/data';
import {getRandNumber} from "./components/utils";


const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getArrayForRender = (array, numberElement = COUNT_CARDS.filmsList) => {
  const arrayAmount = Math.ceil(array.length / numberElement);
  return new Array(arrayAmount).fill(``).map((item, index) => array.slice(index * numberElement, (index + 1) * numberElement));
};


const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics p`);

render(headerElement, createSearchTemplate());
render(headerElement, createProfileTemplate(getRandNumber(getFilmsAmount())));
render(mainElement, createMenuTemplate(getFilmsAmount()));

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreTemplate());

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? filmCards().slice(0, COUNT_CARDS.filmsList) : filmCards();
firstArrayFilmCards.forEach((card) => render(filmsListContainerElement, createCardTemplate(card)));

const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

extraFilmsListElements.forEach((films) => {
  const container = films.querySelector(`.films-list__container`);
  filmCards().slice(0, 2).forEach((card) => render(container, createCardTemplate(card)));
});

statisticsElement.textContent = `${getFilmsAmount()} movies inside`;
// render(document.body, createPopupTemplate(getFilmCard(), filmComments()));

const loadButtonShowMoreElement = document.querySelector(`.films-list__show-more`);

if (getFilmsAmount() <= COUNT_CARDS.filmsList) {
  filmsListElement.removeChild(loadButtonShowMoreElement);
}

let currArray = 0;

loadButtonShowMoreElement.addEventListener(`click`, () => {
  const renderArrayFilmCards = getArrayForRender(filmCards().slice(COUNT_CARDS.filmsList));
  renderArrayFilmCards[currArray].forEach((item) => render(filmsListContainerElement, createCardTemplate(item)));
  currArray++;
  if (currArray === renderArrayFilmCards.length) {
    filmsListElement.removeChild(loadButtonShowMoreElement);
  }
});
