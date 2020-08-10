require('dotenv').config();

const Application = require('./src/_shared/application');

(async () => {
  try {
    const server = new Application();
    server.init();
  } catch (err) {
    console.log(err);
  }
})();
