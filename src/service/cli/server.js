const {HttpCode, DEFAULT_PORT} = require(`../../const`);
const chalk = require(`chalk`);
const fs = require(`fs/promises`);
const http = require(`http`);

const FILE_NAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Объявления</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.status = statusCode;

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not Found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME, `utf-8`);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`connection`, () => {
        return console.info(chalk.green(`Соединение установлено`));
      });
  }
};
