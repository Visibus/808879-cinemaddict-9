import {ModelFilm} from './model-film';
import {ModelComment} from './model-comment';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

export class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelFilm.parseCards);
  }

  updateCard({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  getComments({id}) {
    return this._load({url: `comments/${id}`})
      .then(toJSON)
      .then(ModelComment.parseComments);
  }

  createComment({id, data}) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(data),
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
