import {emojis} from "../components/utils";
import moment from "moment";

export default class ModelComment {
  constructor(response) {
    this.id = response[`id`];
    this.text = response[`comment`];
    this.author = response[`author`];
    this.date = moment(response[`date`]).fromNow();
    this.emoji = {
      id: response[`emotion`],
      source: emojis.reduce((acc, emoji) => {
        if (emoji.id === response[`emotion`]) {
          acc = emoji.source;
        }

        return acc;
      }, ``),
    };
  }

  static parseComment(comment) {
    return new ModelComment(comment);
  }

  static parseComments(comments) {
    return comments.map(ModelComment.parseComment);
  }

  static toRAW(comment) {
    return {
      'comment': comment.text,
      'date': comment.date,
      'emotion': comment.emoji.id,
    };
  }
}
