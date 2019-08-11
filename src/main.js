import {createSearchTemplate} from './components/search.js';
import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createCardTemplate} from './components/card.js';
import {createShowMoreTemplate} from './components/show-more.js';
import {createPopupTemplate} from './components/popup.js';


const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

render(headerElement, createSearchTemplate());
render(headerElement, createProfileTemplate());
render(mainElement, createMenuTemplate());

const filmsList = mainElement.querySelector(`.films-list`);
render(filmsList, createShowMoreTemplate());

const filmsListsContainer = mainElement.querySelectorAll(`.films-list__container`);
filmsListsContainer.forEach((element, index) => {
  let key = Object.keys(COUNT_CARDS)[index];
  for (let i = 0; i < COUNT_CARDS[key]; i++) {
    render(element, createCardTemplate());
  }
});

render(footerElement, createPopupTemplate(), `afterend`);

