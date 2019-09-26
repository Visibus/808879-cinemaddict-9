import {MovieController} from './movie-controller';
import {COUNT_CARDS, render, removeElement, unrender} from '../components/utils';
import {getFilmsAmount} from '../components/data';
import {ShowMore} from '../components/show-more.js';
import {Films} from "../components/films";
import {FilmsList} from "../components/films-list";

export class FilmCardsController {
  constructor(containerMain, container, onDataChange) {
    this._containerMain = containerMain;
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._cards = [];
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._currArray = 0;
    this._showMore = new ShowMore();
    this._films = new Films();
    this._filmsList = new FilmsList();
  }

  setFilmCards(cards) {
    this._cards = cards;
    this._subscriptions = [];
    this._container.innerHTML = ``;
    this._unrenderShowMore();

    const firstArrayFilmCards = (getFilmsAmount() > COUNT_CARDS.filmsList) ? this._cards.slice(0, COUNT_CARDS.filmsList) : cards;
    firstArrayFilmCards.forEach((card) => this._renderFilmCard(card));

    this._currArray = 0;
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
    const getArrayForRender = (array, numberElement = COUNT_CARDS.filmsList) => {
      const arrayAmount = Math.ceil(array.length / numberElement);
      return new Array(arrayAmount).fill(``).map((item, index) => array.slice(index * numberElement, (index + 1) * numberElement));
    };

    const renderArrayFilmCards = getArrayForRender(this._cards.slice(COUNT_CARDS.filmsList));
    renderArrayFilmCards[this._currArray].forEach((item) => this._renderFilmCard(item));
    this._currArray++;
    if (this._currArray === renderArrayFilmCards.length) {
      removeElement(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((card) => card === oldData)] = newData;
    this.setFilmCards(this._cards);
    this._onDataChangeMain(newData, oldData);
  }

  _unrenderShowMore() {
    const buttonLoadMore = Array.from(this._containerMain.querySelectorAll(`.films-list__show-more`));
    if (buttonLoadMore) {
      buttonLoadMore.forEach((elemButton) => unrender(elemButton));
    }
  }
}
