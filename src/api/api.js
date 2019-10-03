import ModelFilm from "./model-film";
import ModelComment from "./model-comment";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const statusResponse = {
  MIN_OK: 200,
  MAX_OK: 300
};

const checkStatus = (response) => {
  if (response.status >= statusResponse.MIN_OK && response.status < statusResponse.MAX_OK) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelFilm.parseCards);
  }

  updateCard({id, card}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(card),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  getComments({id}) {
    return this._load({url: `comments/${id}`})
      .then(toJSON)
      .then(ModelComment.parseComments);
  }

  createComment({id, card}) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(card),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  deleteComment({id}) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw new Error(`fetch error: ${err}`);
      });
  }
}
