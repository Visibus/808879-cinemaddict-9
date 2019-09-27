import {objectToArray} from "../components/utils";

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    return this._api.getCards()
      .then((cards) => {
        cards.map((card) => this._store.setItem({key: card.id, item: card}));
        return cards;
      });
  }

  syncCards() {
    return this._api.syncCards({cards: objectToArray(this._store.getAll())});
  }

  updateCard({id, data}) {
    return this._api.updateCard({id, data})
        .then((card) => {
          this._store.setItem({key: card.id, item: card});
          return card;
        });
  }
}
