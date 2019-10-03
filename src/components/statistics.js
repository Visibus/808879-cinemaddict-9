import {getMostFrequents} from "./utils";
import AbstractComponent from "./abstract-component";
import moment from "moment";


export default class Statistics extends AbstractComponent {
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

    this._topGenre = getMostFrequents(watchedGenres)[0];

    const sumDuration = (cards) => cards.reduce((acc, card) => {
      if (card.watched) {
        acc = acc + card.duration;
      } return acc;
    }, 0);

    return `<div>
      <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._cards.filter((card) => card.watched).length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${moment.utc(moment.duration(sumDuration(this._cards), `minutes`).asMilliseconds()).format(`H`)}
        <span class="statistic__item-description">h</span> ${moment.utc(moment.duration(sumDuration(this._cards), `minutes`).asMilliseconds()).format(`mm`)}
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
  </div>`;
  }
}
