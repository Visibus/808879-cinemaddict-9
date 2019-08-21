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
