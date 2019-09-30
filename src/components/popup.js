import {createElement} from "./utils";
import moment from "moment";


export default class Popup {
  constructor({titles, rating, duration, poster, genres, watchlist, watched, favorite, details: {originalTitle, age, director, writers, actors, releaseDate, countries, description}, comments, ratingViewer}) {
    this._element = null;
    this._titles = titles;
    this._rating = rating;
    this._duration = duration;
    this._poster = poster;
    this._genres = genres;
    this._watchlist = watchlist;
    this._watched = watched;
    this._favorite = favorite;
    this._details = {
      _originalTitle: originalTitle,
      _age: age,
      _director: director,
      _writers: writers,
      _actors: actors,
      _releaseDate: releaseDate,
      _countries: countries,
      _description: description
    };
    this._comments = comments;
    this._ratingViewer = ratingViewer;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="form-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${this._poster}" alt="">

        <p class="film-details__age">${this._details._age}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._titles}</h3>
            <p class="film-details__title-original">Original: ${this._details._originalTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._rating}</p>
            <p class="film-details__user-rating">${(this._ratingViewer && this._watched) ? `Your rate ${this._ratingViewer}` : ``}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${this._details._director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${this._details._writers.join(`, `)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${this._details._actors.join(`, `)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${moment(this._details._releaseDate).format(`D MMM YYYY`)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${moment.utc(moment.duration(this._duration, `minutes`).asMilliseconds()).format(`H`) + ` h ` +
            moment.utc(moment.duration(this._duration, `minutes`).asMilliseconds()).format(`m`) + ` m`}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${this._details._countries}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${this._genres.length > 1 ? `Genres` : `Genre`}</td>
            <td class="film-details__cell">
              <span class="film-details__genre">
                ${this._genres
                .map((genre) => `<span class="film-details__genre">${genre}</span>`)
                .join(``)}</span>
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${this._details._description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._watchlist ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._watched ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._favorite ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>
  </div>

  <div class="form-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
      <ul class="film-details__comments-list">
    </ul>

    <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label"></div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>
    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
      <label class="film-details__emoji-label" for="emoji-gpuke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>
</section>
</div>
</form>
</section>`.trim();
  }

  removeElement() {
    this._element = null;
  }

}
