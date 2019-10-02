import {MIN_LENGTH_SEARCH_STRING, removeElement, render} from "../components/utils";
import FilmCardsController from "./film-cards";
import SearchResult from "../components/search-result";
import SearchNoResult from "../components/search-no-result";
import FilmsList from "../components/films-list";

export default class SearchController {
  constructor(container, search, cards, onDataChange) {
    this._container = container;
    this._search = search;
    this._cards = cards;
    this._onDataChangeMain = onDataChange;

    this._searchResult = new SearchResult();
    this._noResult = new SearchNoResult();
    this._filmsList = new FilmsList();
    this._filmCardsController = new FilmCardsController(null, null, this._onDataChange.bind(this));
  }

  _onDataChange(cards) {
    this._cards = cards;
    this._onDataChangeMain(this._cards);
  }

  show() {
    this._searchResult.getElement().classList.remove(`visually-hidden`);
    this._noResult.getElement().classList.remove(`visually-hidden`);
    this._filmsList.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
    this._noResult.getElement().classList.add(`visually-hidden`);
    this._filmsList.getElement().classList.add(`visually-hidden`);
  }

  init() {
    this.hide();
    this._search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
      if (evt.target.value.length >= MIN_LENGTH_SEARCH_STRING) {
        const cards = this._cards.filter((card) => (card.titles.includes(evt.target.value) || card.titles.toLowerCase().includes(evt.target.value)));
        this._showSearchResult(cards);
      }
    });
  }

  _showSearchResult(cards) {
    if (this._searchResult) {
      removeElement(this._searchResult.getElement());
      this._searchResult.removeElement();
    }

    if (cards.length) {
      removeElement(this._noResult.getElement());
      this._noResult.removeElement();
      this._searchResult = new SearchResult(cards.length);
      render(this._container, this._searchResult.getElement());
      render(this._container, this._filmsList.getElement());
      this._filmCardsController = new FilmCardsController(this._container, this._filmsList.getElement().querySelector(`.films-list__container`), this._onDataChange.bind(this));
      this._filmCardsController.setFilmCards(cards);
    } else {
      removeElement(this._filmsList.getElement());
      this._filmsList.removeElement();
      render(this._container, this._noResult.getElement());
    }
  }


}
