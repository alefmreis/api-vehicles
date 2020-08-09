const swagger = require('../business/models/swagger.model');

class SwaggerController {
  async load(ctx) {
    ctx.body = swagger;
  }
}

module.exports = new SwaggerController();