const express = require(`express`);
const request = require(`supertest`);
const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const mockData = require(`../../data/mockData`);
const {HttpCode} = require(`../../const`);

const createAPI = (services) => {
  const app = express();
  app.use(express.json());
  offer(app, ...services);
  return app;
};

describe(`Offer`, () => {
  describe(`API returns the a list of offers`, () => {
    let app = null;
    let response = null;
    let cloneData = null;

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      app = createAPI([new OfferService(cloneData), new CommentService()]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/offers`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`A list 5 offers`, async () => {
      response = await request(app).get(`/offers`);
      expect(response.body.length).toBe(5);
    });
    test(`First offer ID is "GIjdijcL"`, async () => {
      response = await request(app).get(`/offers`);
      expect(response.body[0].id).toBe(`GIjdijcL`);
    });
  });

  describe(`API returns an offer by ID`, () => {
    let app = null;
    let response = null;
    let cloneData = null;

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      app = createAPI([new OfferService(cloneData), new CommentService()]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/offers/GIjdijcL`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Offer's title is "Куплю породистого кота."`, async () => {
      response = await request(app).get(`/offers/GIjdijcL`);
      expect(response.body.title).toBe(`Куплю породистого кота.`);
    });
  });

  describe(`API creates an offer`, () => {
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    const newOffer = {
      category: `Категория`,
      title: `Заголовок`,
      description: `Описания предложения`,
      picture: `picture.jpg`,
      type: `offer`,
      sum: 100,
    };

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 201`, async () => {
      response = await request(app).post(`/offers`).send(newOffer);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Created offer is returned`, async () => {
      response = await request(app).post(`/offers`).send(newOffer);
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });
    test(`Offer is created`, async () => {
      response = await request(app).post(`/offers`).send(newOffer);
      const result = offerService.findOne(response.body.id);
      expect(result).toMatchObject(response.body);
    });
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

    const app = createAPI([new OfferService(mockData), new CommentService()]);

    test(`Status code 400 if one of required property is missed`, async () => {
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

  describe(`API changes an offer`, () => {
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    const newOffer = {
      category: `Категория`,
      title: `Заголовок`,
      description: `Описания предложения`,
      picture: `picture.jpg`,
      type: `offer`,
      sum: 100,
    };

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).put(`/offers/j8gydnqp`).send(newOffer);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Changed offer is returned`, async () => {
      response = await request(app).put(`/offers/j8gydnqp`).send(newOffer);
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });
    test(`Whether offer is really changed`, async () => {
      response = await request(app).put(`/offers/j8gydnqp`).send(newOffer);
      const result = offerService.findOne(response.body.id);
      expect(result.title).toBe(`Заголовок`);
    });
  });

  describe(`API refuses to change an offer`, () => {
    const app = createAPI([new OfferService(mockData), new CommentService()]);

    test(`Status code 404 if offer doesn't exist`, () => {
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

    test(`Status code 400 when data is invalid`, () => {
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
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/offers/lzWZcilL`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Deleted offer is returned`, async () => {
      response = await request(app).delete(`/offers/lzWZcilL`);
      expect(response.body.id).toBe(`lzWZcilL`);
    });
    test(`Offer is deleted`, async () => {
      response = await request(app).delete(`/offers/lzWZcilL`);
      const result = offerService.findOne(response.body.id);
      expect(result).toBe(undefined);
    });
  });

  describe(`API refuses to delete an offer`, () => {
    const app = createAPI([new OfferService(mockData), new CommentService()]);
    test(`If offer doesn't exist`, () => {
      return request(app)
        .delete(`/offers/DONT_EXIST`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns a list of comments by offer ID`, () => {
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/offers/GIjdijcL/comments`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`List of 4 comments`, async () => {
      response = await request(app).get(`/offers/GIjdijcL/comments`);
      expect(response.body.length).toBe(4);
    });
    test(`First comment id is "e4t-pEpN"`, async () => {
      response = await request(app).get(`/offers/GIjdijcL/comments`);
      expect(response.body[0].id).toBe(`e4t-pEpN`);
    });
  });

  describe(`API creates a comment`, () => {
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    const newComment = {text: `New comment's text.`};

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 201`, async () => {
      response = await request(app).post(`/offers/GIjdijcL/comments`).send(newComment);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Created comment is returned`, async () => {
      response = await request(app).post(`/offers/GIjdijcL/comments`).send(newComment);
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });
  });

  describe(`API refuses to create a comment`, () => {
    const app = createAPI([new OfferService(mockData), new CommentService()]);

    test(`If offer doesn't exist`, () => {
      return request(app)
        .post(`/offers/NON_EXISTENT_ID/comments`)
        .send({
          text: `Comment's text`
        })
        .expect(HttpCode.NOT_FOUND);
    });

    test(`If comment's body is invalid`, () => {
      return request(app)
        .post(`/offers/GIjdijcL/comments`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API deletes a comment of an offer`, () => {
    let app = null;
    let response = null;
    let cloneData = null;
    let offerService = null;
    let commentService = null;

    beforeEach(async () => {
      cloneData = JSON.parse(JSON.stringify(mockData));
      offerService = new OfferService(cloneData);
      commentService = new CommentService();
      app = createAPI([offerService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/offers/GIjdijcL/comments/IJQ2Drkt`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Deleted comment is returned`, async () => {
      response = await request(app).delete(`/offers/GIjdijcL/comments/IJQ2Drkt`);
      expect(response.body.id).toBe(`IJQ2Drkt`);
    });
  });

  describe(`API refuses to delete a comment`, () => {
    const app = createAPI([new OfferService(mockData), new CommentService()]);

    test(`If comment doesn't exist`, () => {
      return request(app)
        .delete(`/offers/GIjdijcL/comments/NON_EXISTENT`)
        .expect(HttpCode.NOT_FOUND);
    });
    test(`If offer doesn't exist`, () => {
      return request(app)
        .delete(`/offers/NON_EXISTENT/comments/IJQ2Drkt`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});
