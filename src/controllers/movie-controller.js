import Card from "../components/card";
import Popup from "../components/popup";
import {render, unrender, removeElement, createElement, END_POINT, AUTHORIZATION} from "../components/utils";
import Rating from "../components/rating";
import Comments from "../components/comments";
import API from "../api/api";
import ModelComment from "../api/model-comment";
import ModelFilm from "../api/model-film";
import moment from "moment";

export default class MovieController {
  constructor(container, card, onDataChange, onChangeView) {
    this._container = container;
    this._card = card;
    this._filmCard = new Card(card);
    this._filmDetails = new Popup(card);
    this._rating = new Rating(card);
    this._userRatingElement = this._filmDetails.getElement().querySelector(`.film-details__user-rating`);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

    this.init();
  }

  init() {
    let commentsListElement = null;
    let containerRatingElement = null;

    const entry = JSON.parse(JSON.stringify(this._card));

    const getContainer = () => {
      const formContainerElement = this._filmDetails.getElement().querySelector(`.film-details__inner`);
      const containerTopElement = this._filmDetails.getElement().querySelector(`.form-details__bottom-container`);
      containerRatingElement = document.createElement(`div`);
      containerRatingElement.classList.add(`form-details__middle-container`);
      formContainerElement.insertBefore(containerRatingElement, containerTopElement);
      return containerRatingElement;
    };

    const renderFilmDetails = () => {
      render(document.body, this._filmDetails.getElement());
      this._filmCard.removeElement();
    };

    const onCommentsAdd = (evt, idFilm, newComm) => {
      this._api.createComment({id: idFilm, card: ModelComment.toRAW(newComm)})
        .then(() => {
          evt.target.disabled = false;
          evt.target.value = ``;
          evt.target.blur();
          evt.target.classList.remove(`input-error`);
          renderComment();
        })
        .catch(() => {
          evt.target.disabled = false;
          evt.target.classList.add(`input-error`);
        });
    };

    const onCommentsDelete = (evt, index, comments) => {
      evt.target.disabled = true;
      evt.target.textContent = `Deleting…`;
      this._api.deleteComment({id: comments[index].id})
        .then(() => {
          evt.target.disabled = false;
          evt.target.textContent = `Delete`;
          renderComment();

        })
        .catch(() => {
          evt.target.disabled = false;
          evt.target.textContent = `Delete`;
        });
    };

    const renderComment = () => {
      commentsListElement = this._filmDetails.getElement().querySelector(`.film-details__comments-list`);
      commentsListElement.innerHTML = ``;

      this._api.getComments({id: this._card.id}).then((comments) => {
        comments.forEach((commentCurrent, index) => {
          const comment = new Comments(commentCurrent);
          comment.getElement()
          .querySelector(`.film-details__comment-delete`)
          .addEventListener(`click`, (evt) => {
            evt.preventDefault();
            onCommentsDelete(evt, index, comments);
          });

          commentsListElement = this._filmDetails.getElement().querySelector(`.film-details__comments-list`);
          render(commentsListElement, comment.getElement());
        });
        this._filmDetails.getElement().querySelector(`.film-details__comments-count`).textContent = `${comments.length}`;
        entry.comments = this._card.comments;
      });
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
      renderComment();
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
        entry.watchlist = entry.watchlist ? false : true;
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        entry.watched = entry.watched ? false : true;
        if (document.querySelector(`.film-details__user-rating-wrap`)) {
          unrender(containerRatingElement);
          this._userRatingElement = this._filmDetails.getElement().querySelector(`.film-details__user-rating`);
          this._userRatingElement.textContent = ``;
          entry.ratingViewer = null;
        } else {
          render(getContainer(), this._rating.getElement());
          const chosenRatingElement = this._rating.getElement().querySelector(`.film-details__user-rating-input:checked`);
          if (chosenRatingElement) {
            chosenRatingElement.checked = false;
          }
        }
        this._onDataChange(entry, this._card);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        entry.favorite = entry.favorite ? false : true;
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._filmDetails.getElement().
    querySelectorAll(`.film-details__emoji-label`).
    forEach((element) => {
      element.addEventListener(`click`, () => {
        const imageElement = element.querySelector(`img`);
        this._filmDetails.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
        this._filmDetails.getElement().querySelector(`.film-details__add-emoji-label`)
        .appendChild(createElement(`<img src="${imageElement.src}" width="55" height="55" alt="emoji">`));
      });
    });

    this._filmDetails.getElement()
    .querySelector(`.film-details__comment-input`)
    .addEventListener(`keydown`, (evt) => {

      const commentFieldElement = this._filmDetails.getElement().querySelector(`.film-details__comment-input`);
      const checkedInputElement = this._filmDetails.getElement().querySelector(`.film-details__emoji-item:checked`);
      const chosenEmojiElement = this._filmDetails.getElement().querySelector(`.film-details__add-emoji-label img`);

      if ((evt.key === `Enter` && evt.metaKey) || (evt.key === `Enter` && evt.ctrlKey)) {
        if (!commentFieldElement.value || !checkedInputElement || !chosenEmojiElement) {
          return;
        }
        const createComment = (emoji) => {
          const textariaElement = this._filmDetails.getElement().querySelector(`.film-details__comment-input`);
          const newComment = {
            text: textariaElement.value,
            author: ``,
            date: moment(),
            emoji: {
              id: emoji.src.slice(emoji.src.lastIndexOf(`/`) + 1, emoji.src.lastIndexOf(`.png`)),
            }
          };

          onCommentsAdd(evt, this._card.id, newComment);

          this._filmDetails.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
          textariaElement.value = ``;
          textariaElement.placeholder = `Select reaction below and write comment here`;
        };
        createComment(chosenEmojiElement);
      }
    });

    this._rating.getElement()
    .querySelector(`.film-details__user-rating-score`)
    .addEventListener(`change`, (evt) => {
      this._userRatingElement = this._filmDetails.getElement().querySelector(`.film-details__user-rating`);
      const radioElement = Array.from(this._rating.getElement().querySelectorAll(`.film-details__user-rating-input`));
      entry.ratingViewer = Number(radioElement.length && radioElement.find((r) => r.checked).value);
      const ratingInputElement = this._rating.getElement().querySelector(`[value="${entry.ratingViewer}"]`);
      const ratingInputLabelElement = this._rating.getElement().querySelector(`[for="${evt.target.id}"]`);
      const errorInput = this._rating.getElement().querySelectorAll(`.rating-input-error`);

      if (errorInput) {
        errorInput.forEach((elErrInput) => elErrInput.classList.remove(`rating-input-error`));
      }
      if (this._rating.getElement().classList.contains(`rating-form-error`)) {
        this._rating.getElement().classList.remove(`rating-form-error`);
      }

      this._api.updateCard({
        id: this._card.id,
        card: ModelFilm.toRAW(this._card),
      })
        .then(() => {
          ratingInputElement.checked = true;
          this._userRatingElement.textContent = `Your rate ${evt.target.value}`;
        })
        .catch(() => {
          ratingInputElement.checked = false;
          ratingInputLabelElement.classList.add(`rating-input-error`);
          this._rating.getElement().classList.add(`rating-form-error`);
          entry.ratingViewer = null;
          this._userRatingElement.textContent = ``;
        });


    });

    this._rating.getElement()
    .querySelector(`.film-details__watched-reset`)
    .addEventListener(`click`, () => {
      this._userRatingElement.textContent = ``;
      entry.ratingViewer = null;
      const chosenRatingElement = this._rating.getElement().querySelector(`.film-details__user-rating-input:checked`);
      if (chosenRatingElement) {
        chosenRatingElement.checked = false;
      }
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
