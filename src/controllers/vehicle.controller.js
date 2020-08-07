const { onError } = require('../_shared/helpers/response-handler.helper');
const service = require('../services/vehicle.service');

class VehicleController {
  async getPaged(ctx) {
    try {
      const { query } = ctx.request;
      return service.getPaged(query.offset, query.limit, query.modelId, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async getById(ctx) {
    try {
      const { id } = ctx.params;
      return service.getById(id, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async create(ctx) {
    try {
      const { body } = ctx.request;
      return service.create(body, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async update(ctx) {
    try {
      const { body } = ctx.request;
      const { id } = ctx.params;
      return service.update(id, body, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      return service.delete(id, ctx);
    } catch (error) {
      onError(ctx);
    }
  }
}

module.exports = new VehicleController();
