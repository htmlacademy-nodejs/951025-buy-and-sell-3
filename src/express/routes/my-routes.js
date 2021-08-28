const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  try {
    const offers = await api.getOffers();
    res.render(`my-tickets`, {offers});
  } catch (error) {
    console.log(error);
  }
});

myRouter.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
