const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  try {
    const offers = await api.getOffers();
    res.render(`main`, {offers});
  } catch (error) {
    console.log(error);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {title} = req.query;
    const results = await api.search(title);
    res.render(`search-result`, {results});
  } catch (error) {
    res.render(`search-result`, {results: []});
  }
});

module.exports = mainRouter;
