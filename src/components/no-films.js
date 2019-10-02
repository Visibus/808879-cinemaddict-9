import {createElement} from "./utils";

export default class NoFilms {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section class="films">
              <section class="films-list">
                <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

                <div class="no-result">
                  There are no movies in our database.
                </div>
              </section>
            </section>
    `;
  }
}
