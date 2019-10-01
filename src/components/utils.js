import moment from "moment";

const LENGTH_DESCRIPTION_CARD = 139;

export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
export const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
export const MIN_LENGTH_SEARCH_STRING = 3;
export const MIN_RATED = 0;
export const MIN_AMOUNT_COMMENTS = 0;

export const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

export const TagNames = {
  A: `A`
};

export const typeSorting = {
  BY_DEFAULT: {
    TYPE: (a, b) => a.id - b.id,
    SORT: undefined,
  },
  BY_DATE: {
    TYPE: `date`,
    SORT: (a, b) => b.year - a.year,
  },
  BY_RATING: {
    TYPE: `rating`,
    SORT: (a, b) => b.rating - a.rating,
  },
  BY_COMMENTS: {
    TYPE: `comments`,
    SORT: (a, b) => b.commentsAmount - a.commentsAmount,
  },
};

export const typeFilters = {
  ALL: {
    TYPE: `all`,
    FILTER: (n) => n,
  },
  WATCHLIST: {
    TYPE: `watchlist`,
    FILTER: (n) => n.watchlist,
  },
  WATCHED: {
    TYPE: `history`,
    FILTER: (n) => n.watched,
  },
  FAVORITE: {
    TYPE: `favorites`,
    FILTER: (n) => n.favorite,
  },
};

export const menuSections = {
  FILMS: {
    TYPE: `films`
  },
  STATS: {
    TYPE: `stats`
  },
};

export const chartFilters = {
  ALL_TIME: {
    TYPE: `all-time`,
    FILTER: ``
  },
  TODAY: {
    TYPE: `today`,
    FILTER: (film) => moment(film.watchingDate).isoWeekday() === moment().isoWeekday()
  },
  WEEK: {
    TYPE: `week`,
    FILTER: (film) => moment(film.watchingDate).isoWeek() === moment().isoWeek()
  },
  MONTH: {
    TYPE: `month`,
    FILTER: (film) => moment(film.watchingDate).month() === moment().month()
  },
  YEAR: {
    TYPE: `year`,
    FILTER: (film) => moment(film.watchingDate).year() === moment().year()
  },

};

export const UserRating = {
  RANGES: {
    FIRST: 1,
    SECOND: 10,
    THIRD: 11,
    FOURTH: 20,
    FIFTH: 21,
  },
  TITLES: {
    FIRST: `Novice`,
    SECOND: `Fan`,
    THIRD: `Movie Buff`,
  },
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const removeElement = (element) => {
  if (element) {
    element.remove();
  }
};

export const shortDescription = (description) => {
  return description.length < LENGTH_DESCRIPTION_CARD ? description : `${description.slice(0, LENGTH_DESCRIPTION_CARD).trim()}…`;
};

export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const findCounts = (array) => {
  const counts = array.reduce((accum, current) => {
    accum[current] = (accum[current] || 0) + 1;
    return accum;
  }, {});

  // сортируем в порядке убывания значения ключа
  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .reduce((obj, key) => (Object.assign({}, obj, {[key]: counts[key]})), {});
};

export const mostFrequents = (array) => {
  const counts = findCounts(array);
  const maxCount = Math.max(...Object.values(counts));

  return Object.keys(counts).filter((k) => counts[k] === maxCount);
};

export const getUserTitle = (amount) => {
  let title = ``;
  if (amount >= UserRating.RANGES.FIRST && amount <= UserRating.RANGES.SECOND) {
    title = UserRating.TITLES.FIRST;
  } else if (amount >= UserRating.RANGES.THIRD && amount <= UserRating.RANGES.FOURTH) {
    title = UserRating.TITLES.SECOND;
  } else if (amount > UserRating.RANGES.FIFTH) {
    title = UserRating.TITLES.THIRD;
  }
  return title;
};


export const emojis = [
  {
    id: `smile`,
    value: `sleeping`,
    source: `./images/emoji/smile.png`,
  },
  {
    id: `sleeping`,
    value: `neutral-face`,
    source: `./images/emoji/sleeping.png`,
  },
  {
    id: `puke`,
    value: `grinning`,
    source: `./images/emoji/puke.png`,
  },
  {
    id: `angry`,
    value: `grinning`,
    source: `./images/emoji/angry.png`
  }
];

export const ChartConfig = {
  TYPE: `horizontalBar`,
  DATASETS: {
    BACKGROUNDCOLOR: `#ffe800`,
    DATALABELS: {
      ANCHOR: `start`,
      ALIGN: `start`,
      OFFSET: 50,
      COLOR: `#ffffff`,
      FONT: {
        SIZE: 16,
      },
    }
  },
  OPTIONS: {
    LEGEND: {
      DISPLAY: false,
    },
    TOOLTIPS: {
      ENABLED: false,
    },
    LAYOUT: {
      PADDING: {
        LEFT: 200,
      },
    },
    SCALES: {
      XAXES: {
        DISPLAY: false,
        TICKS: {
          BEGINATZERO: true,
          STEPSIZE: 1,
        },
      },
      YAXES: {
        display: false,
        barThickness: 25,
      },
    },
  }
};
