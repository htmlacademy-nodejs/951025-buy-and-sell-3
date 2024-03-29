const {
  CategoryService,
  CommentService,
  OfferService,
  SearchService,
} = require(`../data-service`);

const {Router} = require(`express`);
const category = require(`./category/category`);
const offer = require(`./offer/offer`);
const search = require(`./search/search`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData), new CommentService());
})();

module.exports = app;
