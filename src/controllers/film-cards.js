import {MovieController} from './movie-controller';


export class FilmCardsController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._cards = [];
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setFilmCards(cards) {
    this._cards = cards;
    this._subscriptions = [];
    this._container.innerHTML = ``;
    this._cards.forEach((card) => this._renderFilmCard(card));
  }

  addFilmCards(cards) {
    cards.forEach((card) => this._renderFilmCard(card));
    this._cards = this._cards.concat(cards);
  }

  _renderFilmCard(card) {
    const movieController = new MovieController(this._container, card, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((card) => card === oldData)] = newData;
    this.setFilmCards(this._cards);
    this._onDataChangeMain(this._cards);
  }
}
