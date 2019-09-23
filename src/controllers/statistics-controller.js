import {findCounts, removeElement, render} from "../components/utils";
import {Statistics} from "../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export class StatisticsController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._chart = null;

    this._statistics = new Statistics(this._cards);
  }

  show(cards) {
    this._statistics.getElement().classList.remove(`visually-hidden`);
    if (cards !== this._cards) {
      this._renderStatistics(cards);
      this._renderCharts(cards);
    }
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  init() {
    this._renderStatistics(this._cards);
    this._renderCharts(this._cards);
    this.hide();
  }

  _renderStatistics(cards) {
    removeElement(this._statistics.getElement());
    this._statistics.removeElement();
    this._statistics = new Statistics(cards);
    render(this._container, this._statistics.getElement());
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
