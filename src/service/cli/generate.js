const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  getPictureFileName,
} = require(`../../utils`);

const fs = require(`fs/promises`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга.`,
  `Продам новую приставку Sony Playstation 5.`,
  `Продам отличную подборку фильмов на VHS.`,
  `Куплю антиквариат.`,
  `Куплю породистого кота.`,
  `Продам коллекцию журналов «Огонёк».`,
  `Отдам в хорошие руки подшивку «Мурзилка».`,
  `Продам советскую посуду. Почти не разбита.`,
  `Куплю детские санки.`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const PriceRange = {
  MIN: 1000,
  MAX: 10000,
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: [shuffle(CATEGORIES).slice(1, getRandomInt(0, CATEGORIES.length - 1)).join(`, `)],
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(0, 16), getRandomInt),
    sum: getRandomInt(PriceRange.MIN, PriceRange.MAX),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: OfferType[Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)]]
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Запись в файл успешно завершена`));
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
    }
  }
};
