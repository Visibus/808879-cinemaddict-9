import {Search} from './components/search.js';
import {Profile} from './components/profile.js';
import {Menu} from './components/menu.js';
import {filmCards, getFilmsAmount, filmComments} from './components/data';
import {render, getRandNumber} from "./components/utils";
import {PageController} from './components/page-controller';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics p`);

render(headerElement, new Search().getElement());
render(headerElement, new Profile(getRandNumber(getFilmsAmount())).getElement());
render(mainElement, new Menu(getFilmsAmount()).getElement());

const pageController = new PageController(mainElement, filmCards, filmComments());
pageController.init();

statisticsElement.textContent = `${getFilmsAmount()} movies inside`;
