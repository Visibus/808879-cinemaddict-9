import {Card} from './card.js';
import {Popup} from './popup.js';
import {render, unrender, removeElement} from './utils';
import {Rating} from './rating';


export class MovieController {
  constructor(container, card, onDataChange, onChangeView) {
    this._container = container;
    this._card = card;
    this._filmCard = new Card(card);
    this._filmDetails = new Popup(card);
    this._rating = new Rating(card);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.init();
  }

  _entry() {
    return {
      titles: this._card.titles,
      rating: this._card.rating,
      year: this._card.year,
      duration: this._card.duration,
      genres: this._card.genres,
      poster: this._card.poster,
      description: this._card.description,
      commentsAmount: this._card.commentsAmount,
      watchlist: this._card.watchlist,
      watched: this._card.watched,
      favorite: this._card.favorite,
      details: {
        age: this._card.details.age,
        director: this._card.details.director,
        writers: this._card.details.writers,
        actors: this._card.details.actors,
        releaseDate: this._card.details.releaseDate,
        countries: this._card.details.countries,
        description: this._card.details.description
      },
      comments: this._card.comments,
      ratingViewer: this._ratingViewer
    };
  }

  init() {
    let containerRating = null;
    let emoji = null;

    const entry = this._entry();

    const getContainer = () => {
      const formContainer = this._filmDetails.getElement().querySelector(`.film-details__inner`);
      const containerTop = this._filmDetails.getElement().querySelector(`.form-details__bottom-container`);
      containerRating = document.createElement(`div`);
      containerRating.classList.add(`form-details__middle-container`);
      formContainer.insertBefore(containerRating, containerTop);
      return containerRating;
    };

    const renderFilmDetails = () => {
      render(document.body, this._filmDetails.getElement());
      this._filmCard.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(this._filmDetails.getElement());
        this._filmDetails.removeElement();
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._onDataChange(entry, this._card);
      }
    };

    const onClickFilmCard = () => {
      this._onChangeView();
      renderFilmDetails();
      if (this._card.watched) {
        render(getContainer(), this._rating.getElement());
      }
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    this._filmCard.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onClickFilmCard);
    this._filmCard.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onClickFilmCard);
    this._filmCard.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onClickFilmCard);

    this._filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      unrender(this._filmDetails.getElement());
      this._filmDetails.removeElement();
      this._onDataChange(entry, this._card);
    });

    this._filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        entry.watchlist = this._card.watchlist ? false : true;
        this._onDataChange(entry, this._card);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        entry.watched = this._card.watched ? false : true;
        this._onDataChange(entry, this._card);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        entry.favorite = this._card.favorite ? false : true;
        this._onDataChange(entry, this._card);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        entry.watchlist = this._card.watchlist ? false : true;
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        entry.watched = this._card.watched ? false : true;
        if (document.querySelector(`.film-details__user-rating-wrap`)) {
          unrender(containerRating);
          entry.ratingViewer = null;
        } else {
          render(getContainer(), this._rating.getElement());
        }
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        entry.favorite = this._card.favorite ? false : true;
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
    .querySelector(`.film-details__emoji-list`)
    .addEventListener(`click`, (event) => {
      emoji = event.target.closest(`img`).cloneNode();
      const addEmoji = (image) => {
        const container = this._filmDetails.getElement().querySelector(`.film-details__add-emoji-label`);
        container.innerHTML = ``;
        image.width = 60;
        image.height = 60;
        container.append(image);
      };
      addEmoji(emoji);
    });

    this._rating.getElement()
    .querySelector(`.film-details__user-rating-score`)
    .addEventListener(`change`, () => {
      const radio = Array.from(this._rating.getElement().querySelectorAll(`.film-details__user-rating-input`));
      entry.ratingViewer = Number(radio.length && radio.find((r) => r.checked).value);
    });

    render(this._container, this._filmCard.getElement());
  }

  setDefaultView() {
    if (document.body.contains(this._filmDetails.getElement())) {
      removeElement(this._filmDetails.getElement());
      this._filmDetails.removeElement();
    }
  }

}
