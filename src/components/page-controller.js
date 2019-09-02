import {Films} from './films';
import {ShowMore} from './show-more.js';
import {render, unrender, Position} from './utils';
import {Card} from './card.js';
import {Popup} from './popup.js';
import {filmCards, getFilmsAmount} from './data';
import {NoFilms} from './no-films';
import {Sort} from './sort';

export class PageController {
  constructor(container, cards, comments) {
    this._container = container;
    this._cards = cards;
    this._comments = comments;
    this._films = new Films();
    this._showMore = new ShowMore();
    this._sort = new Sort();
  }
  init() {

    render(this._container, this._sort.getElement());
    render(this._container, this._films.getElement());

    const renderFilm = (container, card, comments) => {
      const filmCard = new Card(card);
      const filmDetails = new Popup(card, comments);

      const onEscKeyDown = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          unrender(filmDetails.getElement());
          filmDetails.removeElement();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };
      const renderFilmDetails = () => {
        render(container, filmDetails.getElement());
        filmCard.removeElement();
      };

      filmCard.getElement()
        .querySelector(`.film-card__poster`)
        .addEventListener(`click`, () => {
          renderFilmDetails();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

      filmCard.getElement()
        .querySelector(`.film-card__title`)
        .addEventListener(`click`, () => {
          renderFilmDetails();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

      filmCard.getElement()
        .querySelector(`.film-card__comments`)
        .addEventListener(`click`, () => {
          renderFilmDetails();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

      filmDetails.getElement()
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          unrender(filmDetails.getElement());
          filmDetails.removeElement();
        });

      filmDetails.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`focus`, () => {
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

      filmDetails.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`blur`, () => {
          document.addEventListener(`keydown`, onEscKeyDown);
        });

      render(container, filmCard.getElement());
    };

    const filmsListElement = this._container.querySelector(`.films-list`);
    render(filmsListElement, new ShowMore().getElement());

    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const COUNT_CARDS = {
      filmsList: 5,
      filmsTopRated: 2,
      filmsMostCommented: 2,
    };

    const getArrayForRender = (array, numberElement = COUNT_CARDS.filmsList) => {
      const arrayAmount = Math.ceil(array.length / numberElement);
      return new Array(arrayAmount).fill(``).map((item, index) => array.slice(index * numberElement, (index + 1) * numberElement));
    };

    const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? filmCards().slice(0, COUNT_CARDS.filmsList) : filmCards();
    firstArrayFilmCards.forEach((card) => renderFilm(filmsListContainerElement, card, this._comments));

    const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

    extraFilmsListElements.forEach((films) => {
      const container = films.querySelector(`.films-list__container`);
      filmCards().slice(0, 2).forEach((card) => renderFilm(container, card, this._comments));
    });

    const loadButtonShowMoreElement = document.querySelector(`.films-list__show-more`);

    if (getFilmsAmount() <= COUNT_CARDS.filmsList) {
      filmsListElement.removeChild(loadButtonShowMoreElement);
    }

    let currArray = 0;

    loadButtonShowMoreElement.addEventListener(`click`, () => {
      const renderArrayFilmCards = getArrayForRender(filmCards().slice(COUNT_CARDS.filmsList));
      renderArrayFilmCards[currArray].forEach((item) => renderFilm(filmsListContainerElement, item, this._comments));
      currArray++;
      if (currArray === renderArrayFilmCards.length) {
        filmsListElement.removeChild(loadButtonShowMoreElement);
      }
    });

    if (filmsListContainerElement.childElementCount === 0) {
      Array.from(this._container.children).forEach((it) => {
        unrender(it);
      });
      render(this._container, new NoFilms().getElement(), Position.AFTERBEGIN);
    }
  }


}
