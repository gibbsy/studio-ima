export const getRandomInt = (min, max) => Math.random() * (max - min) + min;

// Converts from degrees to radians.
export const radians = function (degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
export const degrees = function (radians) {
  return radians * 180 / Math.PI;
};