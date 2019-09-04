import {Films} from "./films";
import {FilmsList} from "./films-list";
import {FilmsListContainer} from "./films-list-container";
import {FilmsListTopRated} from "./films-list-top-rated";
import {FilmsListMostCommented} from "./films-list-most-commented";
import {ShowMore} from './show-more.js';
import {COUNT_CARDS, render, unrender, Position} from './utils';
import {Card} from './card.js';
import {Popup} from './popup.js';
import {getFilmsAmount} from './data';
import {NoFilms} from './no-films';
import {Sort} from './sort';

export class PageController {
  constructor(container, cards, comments) {
    this._container = container;
    this._cards = cards;
    this._arraySort = this._cards;
    this._comments = comments;
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsListContainer();
    this._filmsListTopRated = new FilmsListTopRated();
    this._filmsListMostCommented = new FilmsListMostCommented();
    this._noFilms = new NoFilms();
    this._showMore = new ShowMore();
    this._sort = new Sort();
    this._currArray = 0;
  }
  init() {

    render(this._container, this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    render(this._container, this._films.getElement());
    render(this._films.getElement(), this._filmsList.getElement());
    render(this._filmsList.getElement(), this._filmsListContainer.getElement());
    render(this._films.getElement(), this._filmsListTopRated.getElement());
    render(this._films.getElement(), this._filmsListMostCommented.getElement());

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? this._cards.slice(0, COUNT_CARDS.filmsList) : this._cards;
    firstArrayFilmCards.forEach((card) => this._renderFilm(filmsListContainerElement, card, this._comments));

    this._loadExtraFilms();

    this._loadShowMore();

    if (filmsListContainerElement.childElementCount === 0) {
      Array.from(this._container.children).forEach((it) => {
        unrender(it);
      });
      render(this._container, this._noFilms.getElement(), Position.AFTERBEGIN);
    }
  }

  _loadExtraFilms() {
    const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

    extraFilmsListElements.forEach((films, index) => {
      const container = films.querySelector(`.films-list__container`);
      switch (index) {
        case 0:
          this._arraySort = this._cards.slice().sort((a, b) => b.rating - a.rating);
          this._arraySort.slice(0, COUNT_CARDS.filmsTopRated).forEach((filmMock) => this._renderFilm(container, filmMock, this._comments));
          break;
        case 1:
          this._arraySort = this._cards.slice().sort((a, b) => b.commentsAmount - a.commentsAmount);
          this._arraySort.slice(0, COUNT_CARDS.filmsMostCommented).forEach((filmMock) => this._renderFilm(container, filmMock, this._comments));
          break;
      }
    });

  }

  _loadShowMore() {
    const filmsListElement = this._container.querySelector(`.films-list`);

    render(filmsListElement, this._showMore.getElement());
    if (getFilmsAmount() <= COUNT_CARDS.filmsList) {
      filmsListElement.removeChild(this._showMore.getElement());
    }
    this._showMore.getElement().addEventListener(`click`, (evt) => this._onClickLoadMore(evt));
  }

  _onClickLoadMore(evt) {
    evt.preventDefault();
    const getArrayForRender = (array, numberElement = COUNT_CARDS.filmsList) => {
      const arrayAmount = Math.ceil(array.length / numberElement);
      return new Array(arrayAmount).fill(``).map((item, index) => array.slice(index * numberElement, (index + 1) * numberElement));
    };

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const renderArrayFilmCards = getArrayForRender(this._cards.slice(COUNT_CARDS.filmsList));
    renderArrayFilmCards[this._currArray].forEach((item) => this._renderFilm(filmsListContainerElement, item, this._comments));
    this._currArray++;
    if (this._currArray === renderArrayFilmCards.length) {
      this._showMore.getElement().style.display = `none`;
    }
  }

  _renderFilm(container, card, comments) {
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

    filmCard.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
      renderFilmDetails();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmCard.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => {
      renderFilmDetails();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmCard.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => {
      renderFilmDetails();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      unrender(filmDetails.getElement());
      filmDetails.removeElement();
    });

    filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(container, filmCard.getElement());

  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._filmsListContainer.getElement().innerHTML = ``;
    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    switch (evt.target.dataset.sortType) {
      case `date`:
        this._arraySort = this._cards.slice().sort((a, b) => a.year - b.year);
        this._arraySort.slice(0, 5).forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock, this._comments));
        break;
      case `rating`:
        this._arraySort = this._cards.slice().sort((a, b) => b.rating - a.rating);
        this._arraySort.slice(0, 5).forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock, this._comments));
        break;
      case `default`:
        this._cards.forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock, this._comments));
        break;
    }
    // сброс счетчика отрисованных страниц с фильмами и показ кнопки Show More
    this._currArray = 0;
    this._showMore.getElement().style.display = `block`;

  }
}
