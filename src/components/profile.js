import {AbstractComponent} from './abstract-component';

export class Profile extends AbstractComponent {
  constructor(amountFilms) {
    super();
    this._amountFilms = amountFilms;
  }
  getTemplate() {
    return `<section class="header__profile profile">
              <p class="profile__rating">${this._amountFilms}</p>
              <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
            </section>
  `;
  }
}
