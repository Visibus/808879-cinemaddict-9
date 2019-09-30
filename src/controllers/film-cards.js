import MovieController from "./movie-controller";
import {COUNT_CARDS, render, removeElement, unrender} from "../components/utils";
import {getFilmsAmount} from "../components/data";
import ShowMore from "../components/show-more";
import Films from "../components/films";
import FilmsList from "../components/films-list";

export default class FilmCardsController {
  constructor(containerMain, container, onDataChange) {
    this._containerMain = containerMain;
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._cards = [];
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._currentListFilms = 0;
    this._showMore = new ShowMore();
    this._films = new Films();
    this._filmsList = new FilmsList();
  }

  setFilmCards(cards) {
    this._cards = cards;
    this._subscriptions = [];
    this._container.innerHTML = ``;
    this._unrenderShowMore();

    const firstListFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? this._cards.slice(0, COUNT_CARDS.filmsList) : cards;
    firstListFilmCards.forEach((card) => this._renderFilmCard(card));

    this._currentListFilms = 0;
    this._loadShowMore();
  }

  _renderFilmCard(card) {
    const movieController = new MovieController(this._container, card, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _loadShowMore() {
    removeElement(this._showMore.getElement());
    this._showMore.removeElement();

    const filmsListElement = this._containerMain.querySelector(`.films-list`);

    render(filmsListElement, this._showMore.getElement());
    if (this._cards.length <= COUNT_CARDS.filmsList) {
      filmsListElement.removeChild(this._showMore.getElement());
    }
    this._showMore.getElement().addEventListener(`click`, (evt) => this._onClickLoadMore(evt));
  }

  _onClickLoadMore(evt) {
    evt.preventDefault();
    const getListFilmsForRender = (list, countElement = COUNT_CARDS.filmsList) => {
      const listAmount = Math.ceil(list.length / countElement);
      return new Array(listAmount).fill(``).map((item, index) => list.slice(index * countElement, (++index) * countElement));
    };

    const renderListFilmCards = getListFilmsForRender(this._cards.slice(COUNT_CARDS.filmsList));
    renderListFilmCards[this._currentListFilms].forEach((item) => this._renderFilmCard(item));
    this._currentListFilms++;
    if (this._currentListFilms === renderListFilmCards.length) {
      removeElement(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((card) => card === oldData)] = newData;
    this._onDataChangeMain(newData, oldData);
  }

  _unrenderShowMore() {
    const buttonLoadMoreElement = Array.from(this._containerMain.querySelectorAll(`.films-list__show-more`));
    if (buttonLoadMoreElement) {
      buttonLoadMoreElement.forEach((buttonElement) => unrender(buttonElement));
    }
  }
}
