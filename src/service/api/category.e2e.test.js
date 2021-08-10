const express = require(`express`);
const request = require(`supertest`);
const mockData = require(`../../data/mockData`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../const`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Returns categories names: "Игры", "Разное", "Книги", "Посуда"`, () => {
    expect(response.body).toEqual(expect.arrayContaining([`Игры`, `Разное`, `Книги`, `Посуда`]));
  });
});
