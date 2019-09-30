import {getRandNumber, getRandElementFromArr, getRandSeveralElementsFromArr, getRandBoolean, getRandDate, getRandItem, emojis} from "./utils";
import moment from "moment";

const AMOUNT_FILMS = 14;
const MAX_COMMENTS_COUNT = 5;
const MAX_ACTORS_COUNT = 3;
const MAX_AGE = 21;
const MAX_RATING = 9;
const MIN_YEAR = 1919;
const RANGE_YEARS = 100;
const MAX_DURATION = 200;


const filmsAmount = AMOUNT_FILMS; // getRandNumber(AMOUNT_FILMS);
const titlesMoc = [`The Shawshank Redemption`, `The Green Mile`, `Pulp Fiction`, `Snatch`, `Lock, Stock and Two Smoking Barrels`, `Interstellar`, `Catch Me If You Can`, `The Lord of the Rings: The Return of the King`, `Forrest Gump`, `Fight Club`, `A Beautiful Mind`, `Back to the Future`, `The Silence of the Lambs`, `Groundhog Day`, `Ghost`];
const descriptionMoc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const namesMoc = [`Anthony Mann`, `Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
const genresMoc = [`action`, `adventure`, `comedy`, `drama`, `crime`, `horror`, `fantasy`, `romance`, `thriller`, `animation`, `family`, `war`, `musical`, `biography`, `sci-fi`, `western`];
const postersMoc = [`./images/posters/made-for-each-other.png`, `./images/posters/popeye-meets-sinbad.png`, `./images/posters/sagebrush-trail.jpg`, `./images/posters/santa-claus-conquers-the-martians.jpg`, `./images/posters/the-dance-of-life.jpg`, `./images/posters/the-great-flamarion.jpg`, `./images/posters/the-man-with-the-golden-arm.jpg`];
const countriesMoc = [`India`, `USA`, `Russia`, `France`, `Italy`];

const commentsMoc = [
  `Interesting setting and a good cast`,
  `Almost two hours? Seriously?`,
  `Booooooooooring`,
  `Very very old. Meh`
];

const getDescription = (descr) => {
  return getRandSeveralElementsFromArr(descr.split(`. `), MAX_ACTORS_COUNT).join(`. `) + `.`;
};
const getRating = () => {
  const firstDigit = getRandNumber(MAX_RATING);
  return firstDigit < MAX_RATING ? `${firstDigit}.${getRandNumber(MAX_RATING - 1)}` : `${firstDigit}.0`;
};

const getFilmComment = () => ({
  emoji: getRandItem(emojis),
  text: getRandElementFromArr(commentsMoc),
  date: getRandDate(),
  author: getRandElementFromArr(namesMoc)
});

const getFilmCard = () => ({
  titles: getRandElementFromArr(titlesMoc),
  rating: getRating(),
  year: `${getRandNumber(RANGE_YEARS) + MIN_YEAR}`,
  duration: getRandNumber(MAX_DURATION),
  genres: getRandSeveralElementsFromArr(genresMoc, MAX_ACTORS_COUNT),
  poster: getRandElementFromArr(postersMoc),
  description: getDescription(descriptionMoc),
  commentsAmount: `${getRandNumber(MAX_COMMENTS_COUNT)}`,
  watchlist: getRandBoolean(),
  watched: getRandBoolean(),
  favorite: getRandBoolean(),
  details: {
    originalTitle: getRandElementFromArr(titlesMoc),
    age: `${getRandNumber(MAX_AGE)}+`,
    director: getRandElementFromArr(namesMoc),
    writers: new Array(MAX_ACTORS_COUNT).fill(``).map(() => getRandElementFromArr(namesMoc)),
    actors: new Array(MAX_ACTORS_COUNT).fill(``).map(() => getRandElementFromArr(namesMoc)),
    releaseDate: moment([getRandNumber(RANGE_YEARS) + MIN_YEAR, getRandNumber(11) + 1, getRandNumber(31)]),
    countries: getRandElementFromArr(countriesMoc),
    description: getDescription(descriptionMoc)
  },
  ratingViewer: getRandNumber(MAX_RATING - 1) + 1,
  watchingDate: getRandDate(),
  comments: Array.from({length: getRandNumber(MAX_COMMENTS_COUNT)}, getFilmComment)
});

const filmCards = Array.from({length: filmsAmount}, getFilmCard);

const getFilmsAmount = () => filmsAmount;

export {filmCards, getFilmsAmount, getFilmCard};
