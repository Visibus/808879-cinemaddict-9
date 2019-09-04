export const COUNT_CARDS = {
  filmsList: 5,
  filmsTopRated: 2,
  filmsMostCommented: 2,
};

export const getRandNumber = (number) => {
  return Math.floor(Math.random() * number);
};

export const getRandElementFromArr = (array) => {
  return array[getRandNumber(array.length)];
};

export const getRandSeveralElementsFromArr = (array, countElements) => {
  return array.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * countElements + 1));
};

export const getRandBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const removeElement = (element) => {
  element.remove();
};

export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
