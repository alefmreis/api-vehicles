const Router = require('koa-router');
const authorizationMiddleware = require('../_shared/middlewares/authorization.middleware');
const controller = require('../controllers/model.controller');
const env = require('../_shared/application.environment');

const routes = new Router();

routes.prefix(`/${env.baseApi}/models`);
routes.get('/', controller.getPaged);
routes.get('/:id', authorizationMiddleware.isLoggedIn, controller.getById);
routes.post('/', authorizationMiddleware.isLoggedIn, controller.create);
routes.put('/:id', authorizationMiddleware.isLoggedIn, controller.update);
routes.delete('/:id', authorizationMiddleware.isLoggedIn, controller.delete);

module.exports = routes;
