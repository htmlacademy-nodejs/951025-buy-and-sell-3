const chalk = require(`chalk`);
const fs = require(`fs/promises`);
const path = require(`path`);
import {MAX_ID_LENGTH} from '../../const';
import {nanoid} from 'nanoid';


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

const generateOffers = (count, contentType) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: [contentType.categories[getRandomInt(0, contentType.categories.length - 1)]],
    description: shuffle(contentType.sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(0, 16), getRandomInt),
    sum: getRandomInt(PriceRange.MIN, PriceRange.MAX),
    title: contentType.titles[getRandomInt(0, contentType.titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)]]
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`).map((item) => item.trim()).filter((item) => item !== ``);
  } catch (err) {
    console.error(chalk.red(`File can't be read, ${err}`));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [sentences, titles, categories] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH)
    ]);

    const contentType = {
      sentences, titles, categories
    };

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, contentType));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Запись в файл успешно завершена`));
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
    }
  }
};
