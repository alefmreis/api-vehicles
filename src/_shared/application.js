const Koa = require('koa');
const cors = require('koa2-cors');
const database = require('../_shared/database/postgres');
const env = require('./application.environment');
const swagger = require('koa2-swagger-ui');

class Application {
  constructor() {
    this.server = new Koa();
    this.setServerMiddlewares();
    this.setRouters();
    this.setDatabase();
  }

  setServerMiddlewares() {
    this.server.use(require('koa-bodyparser')());
    this.server.use(cors({
      allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true
    }));
    this.server.use(swagger({
      title: 'Vehicles MVP - Swagger',
      routePrefix: '/swagger',
      swaggerOptions: {
        url: `http://localhost:${env.port}/${env.baseApi}/swagger`,
      }      
    }));
  }

  setRouters() {
    const RouterLoaderHelper = require('./helpers/router-load.helper');
    const routerLoader = new RouterLoaderHelper(this.server);

    routerLoader.load();
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
