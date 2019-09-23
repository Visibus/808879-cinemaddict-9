import {findCounts, removeElement, render} from "../components/utils";
import {Statistics} from "../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from 'moment';
import {StatisticsFilters} from "../components/statistics-filters";

export class StatisticsController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._chart = null;

    this._statistics = new Statistics(this._cards);
    this._statisticsFilters = new StatisticsFilters(this._cards);
  }

  show(cards) {
    this._statistics.getElement().classList.remove(`visually-hidden`);
    if (cards !== this._cards) {
      this._renderFilters(cards);
      this._renderStatistics(cards);
      this._renderCharts(cards);
    }
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
    this._statisticsFilters.getElement().classList.add(`visually-hidden`);
  }

  init() {
    this._renderFilters(this._cards);
    this._renderStatistics(this._cards);
    this._renderCharts(this._cards);
    this.hide();
  }

  _renderStatistics(cards) {
    removeElement(this._statistics.getElement());
    this._statistics.removeElement();
    this._statistics = new Statistics(cards);
    render(this._statisticsFilters.getElement(), this._statistics.getElement());
  }

  _renderFilters(cards) {
    removeElement(this._statisticsFilters.getElement());
    this._statisticsFilters.removeElement();
    this._statisticsFilters = new StatisticsFilters(cards);
    render(this._container, this._statisticsFilters.getElement());
    const filterInputs = this._statisticsFilters.getElement().querySelectorAll(`.statistic__filters-input`);
    filterInputs.forEach((input) => input.addEventListener(`click`, (evt) => this._onFilterClick(evt, cards)));
  }

  _onFilterClick(evt, cards) {
    // const activeClass = `statistic__filters-input--active`;
    // const activeLinkElement = this._statistics.getElement().querySelector(`.${activeClass}`);
    // if (activeLinkElement) {
    //   activeLinkElement.classList.remove(activeClass);
    // }
    // evt.target.classList.add(activeClass);
    const aa = evt.target.value;
    switch (aa) {
      case `all-time`:
        this._renderStatistics(cards);
        this._renderCharts(cards);
        break;
      case `today`:
        this._renderStatistics(cards.slice().filter((n) => moment(n.watchingDate).isoWeekday() === moment().isoWeekday()));
        this._renderCharts(cards.slice().filter((n) => moment(n.watchingDate).isoWeekday() === moment().isoWeekday()));
        break;
      case `week`:
        this._renderStatistics(cards.slice().filter((n) => moment(n.watchingDate).isoWeek() === moment().isoWeek()));
        this._renderCharts(cards.slice().filter((n) => moment(n.watchingDate).isoWeek() === moment().isoWeek()));
        break;
      case `month`:
        this._renderStatistics(cards.slice().filter((n) => moment(n.watchingDate).month() === moment().month()));
        this._renderCharts(cards.slice().filter((n) => moment(n.watchingDate).month() === moment().month()));
        break;
      case `year`:
        this._renderStatistics(cards.slice().filter((n) => moment(n.watchingDate).year() === moment().year()));
        this._renderCharts(cards.slice().filter((n) => moment(n.watchingDate).year() === moment().year()));
        break;
    }
  }

  _renderCharts(cards) {
    const chartCtx = this._statistics.getElement().querySelector(`.statistic__chart`);
    const watchedGenres = cards.reduce((acc, card) => {
      if (card.watched) {
        card.genres.forEach((cardGenre) => acc.push(cardGenre));
      }

      return acc;
    }, []);

    const dataForChart = findCounts(watchedGenres);
    const dataLabelChart = findCounts(watchedGenres);
    this._chart = new Chart(chartCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(dataLabelChart),
        datasets: [{
          data: Object.values(dataForChart),
          backgroundColor: `#ffe800`,
          datalabels: {
            anchor: `start`,
            align: `start`,
            offset: 50,
            color: `#ffffff`,
            font: {
              size: 16,
            },
            formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}           ${value}`,
          },
        }],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        layout: {
          padding: {
            left: 200,
          },
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          }],
          yAxes: [{
            display: false,
            barThickness: 25,
          }],
        },
      },
    });
  }
}
