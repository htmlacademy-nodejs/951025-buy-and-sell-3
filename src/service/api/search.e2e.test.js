const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const mockData = require(`../../data/mockData`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

