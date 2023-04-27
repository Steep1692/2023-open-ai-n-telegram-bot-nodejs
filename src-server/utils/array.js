export const getRandomArrayItem = (array) => {
  const indexRandom = Math.floor(Math.random() * array.length);
  return array[indexRandom];
};
