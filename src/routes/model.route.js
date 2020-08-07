const Router = require('koa-router');
const controller = require('../controllers/model.controller');
const env = require('../_shared/application.environment');

const routes = new Router();

routes.prefix(`/${env.baseApi}/models`);
routes.get('/', controller.getPaged);
routes.get('/:id', controller.getById);
routes.post('/', controller.create);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.delete);

module.exports = routes;
