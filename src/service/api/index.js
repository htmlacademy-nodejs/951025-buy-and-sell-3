const {
  CategoryService,
  CommentService,
  OfferService,
  SearchService,
} = require(`../data-service`);

const {Router} = require(`express`);
const category = (`./category.js`);
const offer = (`./offer.js`);
const search = (`./search.js`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData), new CommentService());
})();

module.exports = app;
