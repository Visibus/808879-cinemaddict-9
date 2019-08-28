import {createElement} from './utils';

export class Card {
  constructor({titles, poster, description, rating, year, duration, genres, commentsAmount, watchlist, watched, favorite}) {
    this._titles = titles;
    this._poster = poster;
    this._description = description;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genres = genres;
    this._commentsAmount = commentsAmount;
    this._watchlist = watchlist;
    this._watched = watched;
    this._favorite = favorite;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }
  getTemplate() {
    return `
  <article class="film-card">
    <h3 class="film-card__title">${this._titles}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._year}</span>
      <span class="film-card__duration">${this._duration}</span>
      <span class="film-card__genre">${this._genres.join(` `)}</span>
    </p>
    <img src=${this._poster} alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <a class="film-card__comments">${this._commentsAmount} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._watched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${this._favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>
  </article>`.trim();
  }

  removeElement() {
    if (!this._element) {
      this._element = null;
    }
    return this._element;
  }
}
