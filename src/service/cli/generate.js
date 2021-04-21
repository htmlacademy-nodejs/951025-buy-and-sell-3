const chalk = require(`chalk`);
const fs = require(`fs/promises`);
const path = require(`path`);

const {
  getRandomInt,
  shuffle,
  getPictureFileName,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = path.join(__dirname, `../../data/sentences.txt`);
const FILE_CATEGORIES_PATH = path.join(__dirname, `../../data/categories.txt`);
const FILE_TITLES_PATH = path.join(__dirname, `../../data/titles.txt`);

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const PriceRange = {
  MIN: 1000,
  MAX: 10000,
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(0, 16), getRandomInt),
    sum: getRandomInt(PriceRange.MIN, PriceRange.MAX),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)]]
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(`File can't be read, ${err}`));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Запись в файл успешно завершена`));
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
    }
  }
};
