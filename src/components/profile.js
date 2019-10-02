import {getUserTitle} from "./utils";
import AbstractComponent from "./abstract-component";

export default class Profile extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<section class="header__profile profile">
      <p class="profile__rating">${getUserTitle(this._cards.filter((card) => card.watched).length)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`;
  }
}
