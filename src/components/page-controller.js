import {Films} from "./films";
import {FilmsList} from "./films-list";
import {FilmsListContainer} from "./films-list-container";
import {FilmsListTopRated} from "./films-list-top-rated";
import {FilmsListMostCommented} from "./films-list-most-commented";
import {ShowMore} from './show-more.js';
import {COUNT_CARDS, render, unrender, Position, removeElement} from './utils';
import {getFilmsAmount} from './data';
import {NoFilms} from './no-films';
import {Sort} from './sort';
import {MovieController} from './movie-controller';

export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._arraySort = this._cards;
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsListContainer();
    this._filmsListTopRated = new FilmsListTopRated();
    this._filmsListMostCommented = new FilmsListMostCommented();
    this._noFilms = new NoFilms();
    this._showMore = new ShowMore();
    this._sort = new Sort();
    this._currArray = 0;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }
  init() {

    render(this._container, this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    render(this._container, this._films.getElement());
    render(this._films.getElement(), this._filmsList.getElement());
    render(this._filmsList.getElement(), this._filmsListContainer.getElement());

    this._renderFilmList(this._cards);
  }

  _loadExtraFilms() {

    render(this._films.getElement(), this._filmsListTopRated.getElement());
    render(this._films.getElement(), this._filmsListMostCommented.getElement());
    const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

    extraFilmsListElements.forEach((films, index) => {
      const container = films.querySelector(`.films-list__container`);
      switch (index) {
        case 0:
          this._arraySort = this._cards.slice().sort((a, b) => b.rating - a.rating);
          this._arraySort.slice(0, COUNT_CARDS.filmsTopRated).forEach((filmMock) => this._renderFilm(container, filmMock));
          break;
        case 1:
          this._arraySort = this._cards.slice().sort((a, b) => b.commentsAmount - a.commentsAmount);
          this._arraySort.slice(0, COUNT_CARDS.filmsMostCommented).forEach((filmMock) => this._renderFilm(container, filmMock));
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
    renderArrayFilmCards[this._currArray].forEach((item) => this._renderFilm(filmsListContainerElement, item));
    this._currArray++;
    if (this._currArray === renderArrayFilmCards.length) {
      this._showMore.getElement().style.display = `none`;
    }
  }
  _renderFilmList(cards) {

    removeElement(this._films.getElement());
    this._films.removeElement();
    removeElement(this._filmsList.getElement());
    this._filmsList.removeElement();
    removeElement(this._filmsListContainer.getElement());
    this._filmsListContainer.removeElement();

    render(this._container, this._films.getElement());
    render(this._films.getElement(), this._filmsList.getElement());
    render(this._filmsList.getElement(), this._filmsListContainer.getElement());

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? this._cards.slice(0, COUNT_CARDS.filmsList) : cards;
    firstArrayFilmCards.forEach((card) => this._renderFilm(filmsListContainerElement, card));

    removeElement(this._filmsListTopRated.getElement());
    this._filmsListTopRated.removeElement();
    removeElement(this._filmsListMostCommented.getElement());
    this._filmsListMostCommented.removeElement();

    this._loadExtraFilms();

    removeElement(this._showMore.getElement());
    this._showMore.removeElement();

    this._currArray = 0;
    this._loadShowMore();

    if (filmsListContainerElement.childElementCount === 0) {
      Array.from(this._container.children).forEach((it) => {
        unrender(it);
      });
      render(this._container, this._noFilms.getElement(), Position.AFTERBEGIN);
    }
  }

  _renderFilm(container, card) {
    const movieController = new MovieController(container, card, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._filmsListContainer.getElement().innerHTML = ``;
    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
    const buttonSortClass = `sort__button--active`;
    const buttonSortElement = this._sort.getElement().querySelector(`.${buttonSortClass}`);

    switch (evt.target.dataset.sortType) {
      case `date`:
        buttonSortElement.classList.remove(buttonSortClass);
        evt.target.classList.add(buttonSortClass);
        this._arraySort = this._cards.sort((a, b) => a.year - b.year);
        this._arraySort.slice(0, COUNT_CARDS.filmsList).forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock));
        break;
      case `rating`:
        buttonSortElement.classList.remove(buttonSortClass);
        evt.target.classList.add(buttonSortClass);
        this._arraySort = this._cards.sort((a, b) => b.rating - a.rating);
        this._arraySort.slice(0, COUNT_CARDS.filmsList).forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock));
        break;
      case `default`:
        buttonSortElement.classList.remove(buttonSortClass);
        evt.target.classList.add(buttonSortClass);
        this._cards.forEach((filmMock) => this._renderFilm(filmsListContainerElement, filmMock));
        break;
    }
    // сброс счетчика отрисованных страниц с фильмами и показ кнопки Show More
    this._currArray = 0;
    this._showMore.getElement().style.display = `block`;

  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((card) => card === oldData)] = newData;
    this._renderFilmList(this._cards);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}
