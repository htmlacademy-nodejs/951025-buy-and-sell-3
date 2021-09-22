const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const SearchService = require(`../../data-service/search`);
const mockData = require(`../../../data/mockData`);
const {HttpCode} = require(`../../../const`);

const createApi = (services = []) => {
  const app = express();
  app.use(express.json());
  search(app, ...services);
  return app;
};
describe(`Search`, () => {
  describe(`API returns offer based on query`, () => {
    let app = null;
    let response = null;
    let searchService = null;

    beforeEach(() => {
      searchService = new SearchService(mockData);
      app = createApi([searchService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Продам книги Стивена Кинга`
      });

      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns one offer`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Продам книги Стивена Кинга`
      });

      expect(response.body.length).toBe(1);
    });
    test(`Offer's id equals "j8gydnqp"`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Продам книги Стивена Кинга`
      });

      expect(response.body[0].id).toBe(`j8gydnqp`);
    });
  });

  describe(`API refuses to return offer`, () => {
    let app = null;
    let searchService = null;

    beforeEach(() => {
      searchService = new SearchService(mockData);
      app = createApi([searchService]);
    });
    test(`Status code 404 if nothing is found`, (done) => {
      request(app).get(`/search`).query({
        query: `Нет такого заголовка`
      }).expect(HttpCode.NOT_FOUND, done);
    });

    test(`Status code 400 when query string is absent`, (done) => {
      request(app).get(`/search`).expect(HttpCode.BAD_REQUEST, done);
    });
  });
});
