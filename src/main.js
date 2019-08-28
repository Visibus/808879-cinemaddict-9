import {createSearchTemplate} from './components/search.js';
import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {Card} from './components/card.js';
import {createShowMoreTemplate} from './components/show-more.js';
import {Popup} from './components/popup.js';
import {filmCards, getFilmsAmount, filmComments} from './components/data';
import {render, Position, unrender, getRandNumber} from "./components/utils";


const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

const renderComp = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getArrayForRender = (array, numberElement = COUNT_CARDS.filmsList) => {
  const arrayAmount = Math.ceil(array.length / numberElement);
  return new Array(arrayAmount).fill(``).map((item, index) => array.slice(index * numberElement, (index + 1) * numberElement));
};

const renderFilm = (container, card, comments) => {
  const filmCard = new Card(card);
  const filmDetails = new Popup(card, comments);

  const renderFilmDetails = () => {
    render(mainElement, filmDetails.getElement(), Position.BEFOREEND);
    filmCard.removeElement();
  };

  filmCard.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, renderFilmDetails);

  filmCard.getElement()
    .querySelector(`.film-card__title`)
    .addEventListener(`click`, renderFilmDetails);

  filmCard.getElement()
    .querySelector(`.film-card__comments`)
    .addEventListener(`click`, renderFilmDetails);

  filmDetails.getElement()
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => {
      unrender(filmDetails.getElement());
    });

  render(container, filmCard.getElement(), Position.BEFOREEND);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics p`);

renderComp(headerElement, createSearchTemplate());
renderComp(headerElement, createProfileTemplate(getRandNumber(getFilmsAmount())));
renderComp(mainElement, createMenuTemplate(getFilmsAmount()));

const filmsListElement = mainElement.querySelector(`.films-list`);
renderComp(filmsListElement, createShowMoreTemplate());

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? filmCards().slice(0, COUNT_CARDS.filmsList) : filmCards();
firstArrayFilmCards.forEach((card) => renderFilm(filmsListContainerElement, card, filmComments()));

const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

extraFilmsListElements.forEach((films) => {
  const container = films.querySelector(`.films-list__container`);
  filmCards().slice(0, 2).forEach((card) => renderFilm(container, card, filmComments()));
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
  renderArrayFilmCards[currArray].forEach((item) => renderFilm(filmsListContainerElement, item, filmComments()));
  currArray++;
  if (currArray === renderArrayFilmCards.length) {
    filmsListElement.removeChild(loadButtonShowMoreElement);
  }
});
