const {HttpCode, DEFAULT_PORT, API_PREFIX, ExitCode} = require(`../../const`);
const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const NOT_FOUND_MESSAGE = `Not found`;

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(NOT_FOUND_MESSAGE);

  logger.error(`Route not found ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Error is occured on server creation: ${err.message}`);
        }

        return logger.info(`Server is successfully started on port: ${port}`);
      });
    } catch (err) {
      logger.error(`Error is occured: ${err.message}`);
      process.exit(ExitCode.FAIL);
    }
  }
};
