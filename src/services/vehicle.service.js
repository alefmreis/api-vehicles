const { onSuccess, onBadRequest, onNotFound, onUnprocessableEntity, onCreated, onUpdated, onNoContent } = require('../_shared/helpers/response-handler.helper');
const repository = require('../repositories/vehicle.repository');
const check = require('check-types');
const pagingHelper = require('../_shared/helpers/paging.helper');
const vehicleFluentValidate = require('../business/fluent-validators/vehicle.fluent-validator');
const modelService = require('./model.service');

class VehicleService {
  async getPaged(pageOffset, pageLimit, modelId, ctx) {
    if (!check.integer(parseInt(pageOffset, 10)) || !check.integer(parseInt(pageLimit, 10))) {
      return onBadRequest({ message: 'offset and limit must be an integer' }, ctx);
    }

    if (modelId && !check.integer(parseInt(modelId, 10))) {
      return onBadRequest({ message: 'modelId must be an integer' }, ctx);
    }

    const totalVehicles = await repository.count(modelId);
    const vehicles = await repository.getPaged(pageOffset, pageLimit, modelId);

    return onSuccess(pagingHelper(pageOffset, pageLimit, totalVehicles), vehicles, ctx);
  }

  async getById(vehicleId, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'Vehicle id must be an integer' }, ctx);
    }

    const vehicle = await repository.getById(vehicleId);

    if (!vehicle) {
      return onNotFound({ message: `Vehicle ${vehicleId} not found` }, ctx);
    }

    return onSuccess({}, vehicle, ctx);
  }

  async create(vehicle, ctx) {
    const validator = vehicleFluentValidate(vehicle);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const model = await modelService.checkIfModelExistsById(vehicle.model_id);

    if (!model) {
      return onNotFound({ message: `Model ${vehicle.model_id} not found` }, ctx);
    }

    const newVehicle = await repository.create(vehicle);

    return onCreated(newVehicle, ctx);
  }

  async update(vehicleId, vehicle, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'Vehicle id must be an integer' }, ctx);
    }

    const existentVehicle = await this.checkIfVehicleExistsById(vehicleId);

    if (!existentVehicle) {
      return onNotFound({ message: `Vehicle ${vehicleId} not found` }, ctx);
    }

    const validator = vehicleFluentValidate(vehicle);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const model = await modelService.checkIfModelExistsById(vehicle.model_id);

    if (!model) {
      return onNotFound({ message: `Model ${vehicle.model_id} not found` }, ctx);
    }

    const [n, updatedVehicle] = await repository.update(vehicleId, vehicle);

    return onUpdated(updatedVehicle[n - 1], ctx);
  }

  async delete(vehicleId, ctx) {
    if (!check.integer(parseInt(vehicleId, 10))) {
      return onBadRequest({ message: 'VEhicle id must be an integer' }, ctx);
    }

    const vehicle = await this.checkIfVehicleExistsById(vehicleId);

    if (!vehicle) {
      return onNotFound({ message: `Model ${vehicleId} not found` }, ctx);
    }

    await repository.delete(vehicleId);

    return onNoContent(ctx);
  }

  async checkIfVehicleExistsById(vehicleId) {
    const vehicle = await repository.getById(vehicleId);
    return !!vehicle;
  }

  async checkIfVehicleExistsByModelId(modelId) {
    const vehicle = await repository.getByModelId(modelId);
    return !!vehicle;
  }
}

module.exports = new VehicleService();
