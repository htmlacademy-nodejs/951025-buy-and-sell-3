const express = require(`express`);
const request = require(`supertest`);
const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const mockData = require(`../../data/mockData`);
const {HttpCode} = require(`../../const`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new OfferService(cloneData), new CommentService());
  return app;
};

describe(`API returns the offers list`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns 5 offers list`, () => expect(response.body.length).toBe(5));
  test(`ID of the first offer is GIjdijcL`, () => expect(response.body[0].id).toBe(`GIjdijcL`));
});

describe(`API returns an offer with an ID`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/GIjdijcL`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Куплю породистого кота."`, () => expect(response.body.title).toBe(`Куплю породистого кота.`));
});

describe(`API creates an offer. Positive scenario`, () => {
  const app = createAPI();
  let response;

  const newOffer = {
    category: `Категория`,
    title: `Заголовок`,
    description: `Описания предложения`,
    picture: `picture.jpg`,
    type: `offer`,
    sum: 100,
  };

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Returns status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns created offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers length is changed`, () => request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an offer with invalid data`, () => {
  const newOffer = {
    category: `Категория`,
    title: `Заголовок`,
    description: `Описания предложения`,
    picture: `picture.jpg`,
    type: `offer`,
    sum: 100,
  };

  const app = createAPI();

  test(`Returns status code 400 if one of required property is missed`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes an offer: positive scenario`, () => {
  const newOffer = {
    category: `Категория`,
    title: `Заголовок`,
    description: `Описания предложения`,
    picture: `picture.jpg`,
    type: `offer`,
    sum: 100,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/j8gydnqp`)
      .send(newOffer);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Whether offer is really changed`, () => request(app).get(`/offers/j8gydnqp`).expect((res) => {
    expect(res.body.title).toBe(`Заголовок`);
  }));
});

describe(`API changes an offer: negative scenario`, () => {
  const app = createAPI();

  test(`API returns 404 status code when trying to change non-existent offer`, () => {
    const newOffer = {
      category: `Категория`,
      title: `Заголовок`,
      description: `Описания предложения`,
      picture: `picture.jpg`,
      type: `offer`,
      sum: 100,
    };

    return request(app)
      .put(`/offers/ID_NOT_EXIST`)
      .send(newOffer)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when put invalid data`, () => {
    const invalidOffer = {
      category: `Категория`,
      title: `Заголовок`,
      picture: `picture.jpg`,
      type: `offer`,
      sum: 100,
    };

    return request(app)
      .put(`/offers/j8gydnqp`)
      .send(invalidOffer)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/lzWZcilL`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`lzWZcilL`));
  test(`Offers length is 4 now`, () => request(app).get(`/offers`).expect((res) => {
    expect(res.body.length).toBe(4);
  }));
  test(`API refuses to delete non-existent offer`, () => {
    return request(app)
      .delete(`/offers/DONT_EXIST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns the list of comments by offer id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/GIjdijcL/comments`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns the list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment id is e4t-pEpN`, () => expect(response.body[0].id).toBe(`e4t-pEpN`));
});

describe(`API creates a comment with valid data`, () => {
  const app = createAPI();
  let response;
  const newComment = {text: `New comment's text.`};

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/GIjdijcL/comments`)
      .send(newComment);
  });

  test(`Returns status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns created comment`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments length is changed to 5`, () => request(app).get(`/offers/GIjdijcL/comments`)
    .expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API refuses to create a comment`, () => {
  const app = createAPI();

  test(`The offer doesn't exist`, () => {
    return request(app)
      .post(`/offers/NON_EXISTENT_ID/comments`)
      .send({
        text: `Comment's text`
      })
      .expect(HttpCode.NOT_FOUND);
  });

  test(`The comment's body is invalid`, () => {
    return request(app)
      .post(`/offers/GIjdijcL/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API deletes a comment of an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/GIjdijcL/comments/IJQ2Drkt`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted comment`, () => expect(response.body.id).toBe(`IJQ2Drkt`));
  test(`Comments length is changed to 3`, () => request(app)
    .get(`/offers/GIjdijcL/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete a comment`, () => {
  const app = createAPI();

  test(`Comment doesn't exist`, () => {
    return request(app)
      .delete(`/offers/GIjdijcL/comments/NON_EXISTENT`)
      .expect(HttpCode.NOT_FOUND);
  });
  test(`Offer doesn't exist`, () => {
    return request(app)
      .delete(`/offers/NON_EXISTENT/comments/IJQ2Drkt`)
      .expect(HttpCode.NOT_FOUND);
  });
});
