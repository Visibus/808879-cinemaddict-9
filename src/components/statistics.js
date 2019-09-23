import {getUserTitle, mostFrequents} from "./utils";
import {AbstractComponent} from './abstract-component';
import moment from 'moment';


export class Statistics extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
    this._topGenre = null;
  }

  getTemplate() {

    const watchedGenres = this._cards.reduce((acc, card) => {
      if (card.watched) {
        card.genres.forEach((cardGenre) => acc.push(cardGenre));
      }
      return acc;
    }, []);

    this._topGenre = mostFrequents(watchedGenres)[0];

    const sumDuration = (cards) => cards.reduce((acc, card) => {
      if (card.watched) {
        acc = acc + card.duration;
      } return acc;
    }, 0);

    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank 
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"> 
      <span class="statistic__rank-label">${getUserTitle(this._cards.filter((card) => card.watched).length)}</span>
    </p>
  
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
  
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._cards.filter((card) => card.watched).length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${moment.utc(moment.duration(sumDuration(this._cards), `milliseconds`).asMilliseconds()).format(`H`)} 
        <span class="statistic__item-description">h</span> ${moment.utc(moment.duration(sumDuration(this._cards), `milliseconds`).asMilliseconds()).format(`mm`)} 
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._topGenre}</p>
      </li>
    </ul>
  
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000" height="250"></canvas>
    </div>
    
  </section>`;
  }
}
