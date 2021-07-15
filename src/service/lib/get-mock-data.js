const fs = require(`fs`);
const path = require(`path`);

const FILE_NAME = path.join(__dirname, `../mocks.json`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.promises.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
