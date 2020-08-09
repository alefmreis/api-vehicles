const { onError } = require('../_shared/helpers/response-handler.helper');
const service = require('../services/vehicle.service');

class VehicleController {
  async getPaged(ctx) {
    try {
      const { query } = ctx.request;
      await service.getPagedResponse(query.offset, query.limit, query.modelId, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async getById(ctx) {
    try {
      const { id } = ctx.params;
      await service.getByIdResponse(id, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async create(ctx) {
    try {
      const { body } = ctx.request;
      await service.createResponse(body, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async update(ctx) {
    try {
      const { body } = ctx.request;
      const { id } = ctx.params;
      await service.updateResponse(id, body, ctx);
    } catch (error) {
      onError(ctx);
    }
  }

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      await service.deleteResponse(id, ctx);
    } catch (error) {
      onError(ctx);
    }
  }
}

module.exports = new VehicleController();
