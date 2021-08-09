const {HttpCode} = require(`../../const`);
const offerKeys = [`category`, `description`, `picture`, `sum`, `title`, `type`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Not enough offer's parameters. Bad request.`);
  }

  next();
};
