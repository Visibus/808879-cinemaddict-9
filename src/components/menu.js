import {AbstractComponent} from './abstract-component';

const filmFilters = [
  {
    title: `Watchlist`,
    filter: (card) => card.watchlist,
    count: 0,
  }, {
    title: `History`,
    filter: (card) => card.watched,
    count: 0,
  }, {
    title: `Favorites`,
    filter: (card) => card.favorite,
    count: 0,
  }];

const countFilter = (filters, tasks) => {
  for (const el of filters) {
    el.count = tasks.filter(el.filter).length;
  }
};

export class Menu extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
    countFilter(filmFilters, cards);
  }
  getTemplate() {
    return `<nav class="main-navigation">
            <a href="#all" class="main-navigation__item main-navigation__item--active" data-screen="all" >All movies</a>
            ${filmFilters.map((filter) => `<a href="#watchlist"
            class="main-navigation__item">${filter.title} <span class="main-navigation__item-count">${filter.count}</span></a>`).join(``)}
            <a href="#stats" class="main-navigation__item main-navigation__item--additional" data-screen="stats">Stats</a>
            </nav>>`;
  }
}
