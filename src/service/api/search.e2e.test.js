const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const mockData = require(`../../data/mockData`);
const {HttpCode} = require(`../../const`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам книги Стивена Кинга`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`j8gydnqp`));
});

test(`API returns 404 code if nothing is found`, () => {
  request(app)
    .get(`/search`)
    .query({
      query: `Куплю породистого кота`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, () => {
  request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
