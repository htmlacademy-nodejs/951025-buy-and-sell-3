const {HttpCode, DEFAULT_PORT} = require(`../../const`);
const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`);
const path = require(`path`);

const FILE_NAME = path.join(__dirname, `../mocks.json`);
const NOT_FOUND_MESSAGE = `Not found`;

const app = express();
app.use(express.json());
const offersRouter = new express.Router();

offersRouter.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.promises.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.send(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(offersRouter);

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(NOT_FOUND_MESSAGE));

    app.listen(port, (err) => {
      if (err) {
        console.error(chalk.red(`Error is occured while server creation: ${err}`));
      }

      console.log(chalk.green(`Server is successfully started on port: ${port}`));
    });
  }
};
