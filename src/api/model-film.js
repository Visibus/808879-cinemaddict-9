import {shortDescription} from "../components/utils";
import moment from "moment";

export class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.titles = data[`film_info`][`title`];
    this.rating = data[`film_info`][`total_rating`];
    this.year = moment(data[`film_info`][`release`][`date`]).format(`YYYY`);
    this.duration = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.poster = data[`film_info`][`poster`];
    this.description = shortDescription(data[`film_info`][`description`]);
    this.commentsAmount = data[`comments`].length;
    this.watchlist = data[`user_details`][`watchlist`];
    this.watched = data[`user_details`][`already_watched`];
    this.favorite = data[`user_details`][`favorite`];
    this.details = {
      originalTitle: data[`film_info`][`alternative_title`],
      age: data[`film_info`][`age_rating`],
      director: data[`film_info`][`director`],
      writers: data[`film_info`][`writers`],
      actors: data[`film_info`][`actors`],
      releaseDate: moment(data[`film_info`][`release`][`date`]).format(`DD MMMM YYYY`),
      countries: data[`film_info`][`release`][`release_country`],
      description: data[`film_info`][`description`],
    };
    this.ratingViewer = data[`user_details`][`already_watched`] ? data[`user_details`][`personal_rating`] : 0;
    this.watchingDate = data[`user_details`][`watching_date`];
    this.comments = data[`comments`];
  }

  static parseCard(data) {
    return new ModelFilm(data);
  }

  static parseCards(data) {
    return data.map(ModelFilm.parseCard);
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
