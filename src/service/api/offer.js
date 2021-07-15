const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const offerValidator = require(`../middlewares/offer-validator`);

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const offers = await offerService.findAll();
    res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Offer with id: ${offerId} not found`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, offerValidator, (req, res) => {
    const {offerId} = req.params;
    const existedOffer = offerService.findOne(offerId);

    if (!existedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Offer with id: ${offerId} not found`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.drop(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Offer is not found`);
    }

    return res.status(HttpCode.OK).json(offer);
  });
};
