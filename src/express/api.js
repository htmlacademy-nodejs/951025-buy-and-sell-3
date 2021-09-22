const axios = require(`axios`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 6001;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getComments(id) {
    this._load(`/offers/${id}/comments`);
  }

  getOffers() {
    return this._load(`/offers`);
  }

  getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories() {
    return this._load(`/categories`);
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data,
    });
  }

  updateOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: `PUT`,
      data,
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
