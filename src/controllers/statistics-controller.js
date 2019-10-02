import {findCounts, removeElement, render, chartFilters, ChartConfig} from "../components/utils";
import Statistics from "../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import StatisticsFilters from "../components/statistics-filters";

export default class StatisticsController {
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
    const filterInputsElement = this._statisticsFilters.getElement().querySelectorAll(`.statistic__filters-input`);
    filterInputsElement.forEach((input) => input.addEventListener(`click`, (evt) => this._onFilterClick(evt, cards)));
  }

  _onFilterClick(evt, cards) {
    switch (evt.target.value) {
      case chartFilters.ALL_TIME.TYPE:
        this._renderStatistics(cards);
        this._renderCharts(cards);
        break;
      case chartFilters.TODAY.TYPE:
        this._renderStatistics(cards.slice().filter(chartFilters.TODAY.FILTER));
        this._renderCharts(cards.slice().filter(chartFilters.TODAY.FILTER));
        break;
      case chartFilters.WEEK.TYPE:
        this._renderStatistics(cards.slice().filter(chartFilters.WEEK.FILTER));
        this._renderCharts(cards.slice().filter(chartFilters.WEEK.FILTER));
        break;
      case chartFilters.MONTH.TYPE:
        this._renderStatistics(cards.slice().filter(chartFilters.MONTH.FILTER));
        this._renderCharts(cards.slice().filter(chartFilters.MONTH.FILTER));
        break;
      case chartFilters.YEAR.TYPE:
        this._renderStatistics(cards.slice().filter(chartFilters.YEAR.FILTER));
        this._renderCharts(cards.slice().filter(chartFilters.YEAR.FILTER));
        break;
    }
  }

  _renderCharts(cards) {
    const chartCtxElement = this._statistics.getElement().querySelector(`.statistic__chart`);
    const watchedGenres = cards.reduce((acc, card) => {
      if (card.watched) {
        card.genres.forEach((cardGenre) => acc.push(cardGenre));
      }

      return acc;
    }, []);

    const dataForChart = findCounts(watchedGenres);
    const dataLabelChart = findCounts(watchedGenres);
    this._chart = new Chart(chartCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfig.TYPE,
      data: {
        labels: Object.keys(dataLabelChart),
        datasets: [{
          data: Object.values(dataForChart),
          backgroundColor: ChartConfig.DATASETS.BACKGROUNDCOLOR,
          datalabels: {
            anchor: ChartConfig.DATASETS.DATALABELS.ANCHOR,
            align: ChartConfig.DATASETS.DATALABELS.ALIGN,
            offset: ChartConfig.DATASETS.DATALABELS.OFFSET,
            color: ChartConfig.DATASETS.DATALABELS.COLOR,
            font: {
              size: ChartConfig.DATASETS.DATALABELS.FONT.SIZE,
            },
            formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}           ${value}`,
          },
        }],
      },
      options: {
        legend: {
          display: ChartConfig.OPTIONS.LEGEND.DISPLAY,
        },
        tooltips: {
          enabled: ChartConfig.OPTIONS.TOOLTIPS.ENABLED,
        },
        layout: {
          padding: {
            left: ChartConfig.OPTIONS.LAYOUT.PADDING.LEFT,
          },
        },
        scales: {
          xAxes: [{
            display: ChartConfig.OPTIONS.SCALES.XAXES.DISPLAY,
            ticks: {
              beginAtZero: ChartConfig.OPTIONS.SCALES.XAXES.TICKS.BEGINATZERO,
              stepSize: ChartConfig.OPTIONS.SCALES.XAXES.TICKS.STEPSIZE,
            },
          }],
          yAxes: [{
            display: ChartConfig.OPTIONS.SCALES.YAXES.DISPLAY,
            barThickness: ChartConfig.OPTIONS.SCALES.YAXES.barThickness,
          }],
        },
      },
    });
  }
}
