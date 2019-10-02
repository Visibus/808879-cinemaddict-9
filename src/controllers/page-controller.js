import {COUNT_CARDS, render, unrender, Position, removeElement, typeSorting, typeFilters, menuSections, MIN_RATED, MIN_AMOUNT_COMMENTS, TagNames} from "../components/utils";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import FilmsListTopRated from "../components/films-list-top-rated";
import FilmsListMostCommented from "../components/films-list-most-commented";
import NoFilms from "../components/no-films";
import Sort from "../components/sort";
import MovieController from "./movie-controller";
import Statistics from "../components/statistics";
import Menu from "../components/menu";
import FilmCardsController from "./film-cards";


export default class PageController {
  constructor(container, cards, searchController, statisticsController, onDataChange) {
    this._container = container;
    this._cards = cards;
    this._searchController = searchController;
    this._statisticsController = statisticsController;
    this._onDataChangeMain = onDataChange;
    this._selectedCards = this._cards;
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListTopRated = new FilmsListTopRated();
    this._filmsListMostCommented = new FilmsListMostCommented();
    this._noFilms = new NoFilms();
    this._menu = new Menu(cards);
    this._sort = new Sort();
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._statistic = new Statistics();
    this._filmCardsController = new FilmCardsController(null, null, this._onDataChange.bind(this));

  }
  init() {
    render(this._container, this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    render(this._container, this._films.getElement());
    render(this._films.getElement(), this._filmsList.getElement());
    this._selectedSorting = typeSorting.BY_DEFAULT;
    this._selectedFilter = typeFilters.ALL;
    this._renderMenu(this._cards);
    this._renderFilmList(this._cards);

  }

  hide() {
    this._sort.getElement().classList.add(`visually-hidden`);
    this._films.getElement().classList.add(`visually-hidden`);

  }

  show() {
    this._sort.getElement().classList.remove(`visually-hidden`);
    this._films.getElement().classList.remove(`visually-hidden`);
  }

  _loadExtraFilms() {

    removeElement(this._filmsListTopRated.getElement());
    this._filmsListTopRated.removeElement();
    removeElement(this._filmsListMostCommented.getElement());
    this._filmsListMostCommented.removeElement();

    render(this._films.getElement(), this._filmsListTopRated.getElement());
    render(this._films.getElement(), this._filmsListMostCommented.getElement());
    const extraFilmsListElements = Array.from(document.querySelectorAll(`.films-list--extra`));

    extraFilmsListElements.forEach((films, index) => {
      const containerElement = films.querySelector(`.films-list__container`);
      switch (index) {
        case 0:
          if (this._cards.some((cardTopRated) => cardTopRated.rating > MIN_RATED)) {
            this._sortListFilms = this._cards.slice().sort(typeSorting.BY_RATING.SORT);
            this._sortListFilms.slice(0, COUNT_CARDS.filmsTopRated).forEach((filmMock) => this._renderFilm(containerElement, filmMock));
          }
          break;
        case 1:
          if (this._cards.some((cardMostCommented) => cardMostCommented.commentsAmount > MIN_AMOUNT_COMMENTS)) {
            this._sortListFilms = this._cards.slice().sort(typeSorting.BY_DATE.SORT);
            this._sortListFilms.slice(0, COUNT_CARDS.filmsMostCommented).forEach((filmMock) => this._renderFilm(containerElement, filmMock));
          }
          break;
      }
    });

  }

  _renderMenu() {
    removeElement(this._menu.getElement());
    this._menu.removeElement();
    render(this._container, this._menu.getElement(), Position.AFTERBEGIN);

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
    this._filmCardsController = new FilmCardsController(this._container, filmsListContainerElement, this._onDataChange.bind(this));

    const activeFilterElement = this._menu.getElement().querySelector(`[data-screen="${this._selectedFilter.TYPE}"]`);
    activeFilterElement.classList.add(`main-navigation__item--active`);

    this._menu.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== TagNames.A) {
        return;
      }

      evt.preventDefault();
      const activeClass = `main-navigation__item--active`;
      const activeLinkElement = this._menu.getElement().querySelector(`.${activeClass}`);
      activeLinkElement.classList.remove(activeClass);
      evt.target.classList.add(activeClass);

      switch (evt.target.dataset.screen) {
        case typeFilters.ALL.TYPE:
          this.show();
          this._selectedFilter = typeFilters.ALL;
          this._searchController.hide();
          this._statisticsController.hide();
          break;
        case menuSections.STATS.TYPE:
          this.hide();
          this._searchController.hide();
          this._statisticsController.show(this._selectedCards);
          break;
        case typeFilters.WATCHLIST.TYPE:
          this.show();
          this._selectedFilter = typeFilters.WATCHLIST;
          this._searchController.hide();
          this._statisticsController.hide();
          break;
        case typeFilters.WATCHED.TYPE:
          this.show();
          this._selectedFilter = typeFilters.WATCHED;
          this._searchController.hide();
          this._statisticsController.hide();
          break;
        case typeFilters.FAVORITE.TYPE:
          this.show();
          this._selectedFilter = typeFilters.FAVORITE;
          this._searchController.hide();
          this._statisticsController.hide();
          break;
      }
      this._selectedCards = this._cards.slice().filter(this._selectedFilter.FILTER).sort(this._selectedSorting.SORT);
      this._filmCardsController.setFilmCards(this._selectedCards);
    });


  }

  _renderFilmList() {

    removeElement(this._filmsList.getElement());
    this._filmsList.removeElement();
    render(this._films.getElement(), this._filmsList.getElement());

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    this._filmCardsController = new FilmCardsController(this._container, filmsListContainerElement, this._onDataChange.bind(this));
    this._selectedCards = this._cards.slice().filter(this._selectedFilter.FILTER).sort(this._selectedSorting.SORT);
    this._filmCardsController.setFilmCards(this._selectedCards);

    this._loadExtraFilms();

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

    if (evt.target.tagName !== TagNames.A) {
      return;
    }

    const filmsListElement = this._container.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
    this._filmCardsController = new FilmCardsController(this._container, filmsListContainerElement, this._onDataChange.bind(this));
    const buttonSortClass = `sort__button--active`;
    const buttonSortElement = this._sort.getElement().querySelector(`.${buttonSortClass}`);
    buttonSortElement.classList.remove(buttonSortClass);
    evt.target.classList.add(buttonSortClass);

    switch (evt.target.dataset.sortType) {
      case `date`:
        this._selectedSorting = typeSorting.BY_DATE;
        break;
      case `rating`:
        this._selectedSorting = typeSorting.BY_RATING;
        break;
      case `default`:
        this._selectedSorting = typeSorting.BY_DEFAULT;
        break;
    }
    this._selectedCards = this._cards.slice().filter(this._selectedFilter.FILTER).sort(this._selectedSorting.SORT);
    this._filmCardsController.setFilmCards(this._selectedCards);

  }
  _onDataChange(newData, oldData) {
    const index = this._cards.findIndex((card) => card === oldData);
    this._cards[index] = newData;
    this._onDataChangeMain(this._cards[index]);
    this._renderMenu();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}
