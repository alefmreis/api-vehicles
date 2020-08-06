const Koa = require('koa');
const cors = require('koa2-cors');
const database = require('../_shared/database/postgres');
const env = require('./application.environment');

class Application {
  constructor() {
    this.server = new Koa();
    this.setServerMiddlewares();
    this.setDatabase();
  }

  setServerMiddlewares() {
    this.server.use(require('koa-bodyparser')());
    this.server.use(cors({
      allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    }));
  }

  setDatabase() {
    return database.connect();
  }

  init() {
    this.server.listen(env.port);
    console.log(`API Server is listening at port ${env.port}`);
  }
}

module.exports = Application;