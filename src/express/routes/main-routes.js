const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  try {
    const offers = await api.getOffers();
    res.render(`main`, {offers});
  } catch (err) {
    console.log(err);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search-result`));

module.exports = mainRouter;
