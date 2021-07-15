const {HttpCode} = require(`../../const`);

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = service.findOne(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with id: ${offerId} is not found`);
  }

  res.locals.offer = offer;
  return next();
};
