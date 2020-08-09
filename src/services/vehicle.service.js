const { onSuccess, onBadRequest, onNotFound, onUnprocessableEntity, onCreated, onUpdated, onNoContent } = require('../_shared/helpers/response-handler.helper');
const repository = require('../repositories/vehicle.repository');
const check = require('check-types');
const pagingHelper = require('../_shared/helpers/paging.helper');
const vehicleFluentValidate = require('../business/fluent-validators/vehicle.fluent-validator');
const modelService = require('./model.service');

class VehicleService {
  async getPagedResponse(pageOffset, pageLimit, modelId, ctx) {
    if (isNaN(pageOffset) || !check.integer(parseInt(pageOffset, 10))) {
      return onBadRequest({ message: 'Offset must be an integer' }, ctx)
    }

    if (isNaN(pageLimit) || !check.integer(parseInt(pageLimit, 10))) {
      return onBadRequest({ message: 'Limit must be an integer' }, ctx)
    }

    if (pageLimit < 1 || pageLimit > 50) {
      return onBadRequest({ message: 'Limit must be greater than zero and less than fifty' }, ctx)
    }

    if (modelId && (isNaN(modelId) || !check.integer(parseInt(modelId, 10)))) {
      return onBadRequest({ message: 'modelId must be an integer' }, ctx);
    }

    const totalVehicles = await repository.count(modelId);
    const vehicles = await repository.getPaged(pageOffset, pageLimit, modelId);

    return onSuccess(pagingHelper(pageOffset, pageLimit, totalVehicles), vehicles, ctx);
  }

  async getByIdResponse(vehicleId, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'Vehicle id must be an integer' }, ctx);
    }

    const vehicle = await repository.getById(parseInt(vehicleId, 10));

    if (!vehicle) {
      return onNotFound({ message: `Vehicle ${vehicleId} not found` }, ctx);
    }

    return onSuccess({}, vehicle, ctx);
  }

  async createResponse(vehicle, ctx) {
    const validator = vehicleFluentValidate(vehicle);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const model = await modelService.getById(vehicle.model_id);

    if (!model) {
      return onNotFound({ message: `Model ${vehicle.model_id} not found` }, ctx);
    }

    const newVehicle = await repository.create(vehicle);

    return onCreated(newVehicle, ctx);
  }

  async updateResponse(vehicleId, vehicle, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'Vehicle id must be an integer' }, ctx);
    }

    const existentVehicle = await repository.getById(parseInt(vehicleId, 10));

    if (!existentVehicle) {
      return onNotFound({ message: `Vehicle ${vehicleId} not found` }, ctx);
    }

    const resultValidator = vehicleFluentValidate(vehicle);

    if (resultValidator.length > 0) {
      return onUnprocessableEntity(resultValidator, ctx);
    }

    const model = await modelService.getById(vehicle.model_id);

    if (!model) {
      return onNotFound({ message: `Model ${vehicle.model_id} not found` }, ctx);
    }

    const [n, updatedVehicle] = await repository.update(vehicleId, vehicle);

    return onUpdated(updatedVehicle[n - 1], ctx);
  }

  async deleteResponse(vehicleId, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'Vehicle id must be an integer' }, ctx);
    }

    const vehicle = await repository.getById(parseInt(vehicleId, 10));

    if (!vehicle) {
      return onNotFound({ message: `Vehicle ${vehicleId} not found` }, ctx);
    }

    await repository.delete(vehicleId);

    return onNoContent(ctx);
  }

  async getByModelId(modelId) {
    return repository.getByModelId(modelId);
  }
}

module.exports = new VehicleService();
