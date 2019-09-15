import {AbstractComponent} from "./abstract-component";
import moment from 'moment';

export class Comments extends AbstractComponent {
  constructor({emoji, text, date, author}) {
    super();
    this._emoji = emoji;
    this._text = text;
    this._date = date;
    this._author = author;
  }

  getTemplate() {
    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${this._emoji}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${this._text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._author}</span>
          <span class="film-details__comment-day">${moment(this._date).startOf(`day`).fromNow()}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
}
