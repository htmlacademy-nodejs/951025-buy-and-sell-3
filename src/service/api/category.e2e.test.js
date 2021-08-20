const express = require(`express`);
const request = require(`supertest`);
const mockData = require(`../../data/mockData`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
const {HttpCode} = require(`../../const`);

const createApi = (services) => {
  const app = express();
  app.use(express.json());
  category(app, ...services);
  return app;
};

describe(`Category`, () => {
  describe(`API returns a list of categories`, () => {
    let app = null;
    let response;
    let categoryService = null;

    beforeAll(async () => {
      categoryService = new CategoryService(mockData);
      app = createApi([categoryService]);
    });
    test(`API returns status code 200`, async () => {
      response = await request(app).get(`/categories`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`API returns a list of 4 categories`, async () => {
      response = await request(app).get(`/categories`);
      expect(response.body.length).toBe(4);
    });
    test(`Returns categories names: "Игры", "Разное", "Книги", "Посуда"`, async () => {
      response = await request(app).get(`/categories`);
      expect(response.body).toEqual(expect.arrayContaining([`Игры`, `Разное`, `Книги`, `Посуда`]));
    });
  });
});
