module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [arr[i], arr[randomPosition]] = [arr[randomPosition], arr[i]];
  }

  return arr;
};

module.exports.getPictureFileName = (number, func) => {
  if (number < 10) {
    return `item0${func(1, 9)}.jpg`;
  } else {
    return `item${func(10, 16)}.jpg`;
  }
};

module.exports.ensureArray = (value) => Array.isArray(value) ? value : [value];
