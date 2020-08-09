const Router = require('koa-router');
const controller = require('../controllers/swagger.controller');
const env = require('../_shared/application.environment');

const routes = new Router();

routes.prefix(`/${env.baseApi}/swagger`);
routes.get('/', controller.load);


module.exports = routes;
