import {getShortDescription} from "../components/utils";
import moment from "moment";

export default class ModelFilm {
  constructor(response) {
    this.id = response[`id`];
    this.titles = response[`film_info`][`title`];
    this.rating = response[`film_info`][`total_rating`];
    this.year = moment(response[`film_info`][`release`][`date`]).format(`YYYY`);
    this.duration = response[`film_info`][`runtime`];
    this.genres = response[`film_info`][`genre`];
    this.poster = response[`film_info`][`poster`];
    this.description = getShortDescription(response[`film_info`][`description`]);
    this.commentsAmount = response[`comments`].length;
    this.watchlist = response[`user_details`][`watchlist`];
    this.watched = response[`user_details`][`already_watched`];
    this.favorite = response[`user_details`][`favorite`];
    this.details = {
      originalTitle: response[`film_info`][`alternative_title`],
      age: response[`film_info`][`age_rating`],
      director: response[`film_info`][`director`],
      writers: response[`film_info`][`writers`],
      actors: response[`film_info`][`actors`],
      releaseDate: moment(response[`film_info`][`release`][`date`]).format(`DD MMMM YYYY`),
      countries: response[`film_info`][`release`][`release_country`],
      description: response[`film_info`][`description`],
    };
    this.ratingViewer = response[`user_details`][`already_watched`] ? response[`user_details`][`personal_rating`] : 0;
    this.watchingDate = response[`user_details`][`watching_date`];
    this.comments = response[`comments`];
  }

  static parseCard(card) {
    return new ModelFilm(card);
  }

  static parseCards(cards) {
    return cards.map(ModelFilm.parseCard);
  }

  static toRAW(card) {
    return {
      'id': card.id,
      'comments': card.comments,
      'film_info': {
        'title': card.titles,
        'alternative_title': card.details.originalTitle,
        'total_rating': card.rating,
        'poster': card.poster,
        'age_rating': card.details.age,
        'director': card.details.director,
        'writers': [...card.details.writers],
        'actors': [...card.details.actors],
        'release': {
          'date': card.details.releaseDate,
          'release_country': card.details.countries,
        },
        'runtime': card.duration,
        'genre': [...card.genres],
        'description': card.details.description,
      },
      'user_details': {
        'personal_rating': Number(card.ratingViewer) || 0,
        'watchlist': card.watchlist,
        'already_watched': card.watched,
        'favorite': card.favorite,
        'watching_date': moment(card.watchingDate).toISOString() || moment().toISOString(),
      },
    };
  }
}
