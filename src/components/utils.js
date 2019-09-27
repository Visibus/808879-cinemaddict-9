const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const LENGTH_DESCRIPTION_CARD = 139;

export const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

export const MIN_LENGTH_SEARCH_STRING = 3;

export const typeSorting = {
  BY_DEFAULT: {
    TYPE: `default`,
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

export const UserRating = {
  MILESTONES: {
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

export const getRandNumber = (number) => {
  return Math.floor(Math.random() * number);
};

export const getRandElementFromArr = (array) => {
  return array[getRandNumber(array.length)];
};

export const getRandSeveralElementsFromArr = (array, countElements) => {
  return array.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * countElements + 1));
};

export const getRandBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

export const getRandDate = () => {
  return Date.now() - Math.floor(Math.random() * 7) * MILLISECONDS_IN_DAY;
};

export const getRandItem = (list) => {
  const array = Array.isArray(list) ? list : [...list];
  return array[getRandNumber(array.length - 1)];
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
  if (amount >= UserRating.MILESTONES.FIRST && amount <= UserRating.MILESTONES.SECOND) {
    title = UserRating.TITLES.FIRST;
  } else if (amount >= UserRating.MILESTONES.THIRD && amount <= UserRating.MILESTONES.FOURTH) {
    title = UserRating.TITLES.SECOND;
  } else if (amount > UserRating.MILESTONES.FIFTH) {
    title = UserRating.TITLES.THIRD;
  }
  return title;
};

export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
export const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;

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

