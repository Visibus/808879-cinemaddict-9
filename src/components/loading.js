import AbstractComponent from "./abstract-component";

export default class Loading extends AbstractComponent {
  getTemplate() {
    return `<div class="no-result">
        Loading...
      </div>`;
  }
}
