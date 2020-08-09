const { onSuccess, onBadRequest, onNotFound, onUnprocessableEntity, onCreated, onConflict, onUpdated, onNoContent } = require('../_shared/helpers/response-handler.helper');
const repository = require('../repositories/model.repository');
const check = require('check-types');
const pagingHelper = require('../_shared/helpers/paging.helper');
const modelFluentValidate = require('../business/fluent-validators/model.fluent-validator');
const brandService = require('./brand.service');

class ModelService {
  async getPaged(pageOffset, pageLimit, brandId, ctx) {
    if (isNaN(pageOffset) || !check.integer(parseInt(pageOffset, 10))) {
      return onBadRequest({ message: 'Offset must be an integer' }, ctx)
    }

    if (isNaN(pageLimit) || !check.integer(parseInt(pageLimit, 10))) {
      return onBadRequest({ message: 'Limit must be an integer' }, ctx)
    }

    if (pageLimit < 1 || pageLimit > 50) {
      return onBadRequest({ message: 'Limit must be greater than zero and less than fifty' }, ctx)
    }

    if (brandId && (isNaN(brandId) || !check.integer(parseInt(brandId, 10)))) {
      return onBadRequest({ message: 'brandId must be an integer' }, ctx);
    }

    const totalModels = await repository.count(brandId);
    const models = await repository.getPaged(pageOffset, pageLimit, brandId);

    return onSuccess(pagingHelper(pageOffset, pageLimit, totalModels), models, ctx);
  }

  async getById(modelId, ctx) {
    if (!check.integer(parseInt(modelId, 10))) {
      return onBadRequest({ message: 'Model id must be an integer' }, ctx);
    }

    const model = await repository.getById(parseInt(modelId, 10));

    if (!model) {
      return onNotFound({ message: `Model ${modelId} not found` }, ctx);
    }

    return onSuccess({}, model, ctx);
  }

  async create(model, ctx) {
    const validator = modelFluentValidate(model);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const existentModel = await this.checkIfModelExistsByName(model.name);

    if (existentModel) {
      return onConflict({ message: `Model ${model.name} already exists` }, ctx);
    }

    const brand = await brandService.checkIfBrandExistsById(model.brand_id);

    if (!brand) {
      return onNotFound({ message: `Brand ${model.brand_id} not found` }, ctx);
    }

    const newModel = await repository.create(model);

    return onCreated(newModel, ctx);
  }

  async update(modelId, model, ctx) {
    if (!check.integer(parseInt(modelId, 10))) {
      return onBadRequest({ message: 'Model id must be an integer' }, ctx);
    }

    const validator = modelFluentValidate(model);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const existentModel = await this.checkIfModelExistsById(parseInt(modelId, 10));

    if (!existentModel) {
      return onNotFound({ message: `Model ${modelId} not found` }, ctx);
    }

    const existentModelByName = await this.checkIfModelExistsByName(model.name);

    if (existentModelByName) {
      return onConflict({ message: `Model ${model.name} already exists` }, ctx);
    }

    const brand = await brandService.checkIfBrandExistsById(model.brand_id);

    if (!brand) {
      return onNotFound({ message: `Brand ${model.brand_id} not found` }, ctx);
    }

    const [n, updatedModel] = await repository.update(modelId, model);

    return onUpdated(updatedModel[n - 1], ctx);
  }

  async delete(modelId, ctx) {
    if (!check.integer(parseInt(modelId, 10))) {
      return onBadRequest({ message: 'Model id must be an integer' }, ctx);
    }

    const model = await this.checkIfModelExistsById(parseInt(modelId, 10));

    if (!model) {
      return onNotFound({ message: `Model ${modelId} not found` }, ctx);
    }

    const vehicleService = require('./vehicle.service');
    const vehicle = await vehicleService.checkIfVehicleExistsByModelId(modelId);

    if (vehicle) {
      return onConflict({ message: `You can not delete this model ${modelId} because there is a vehicle registered with this model` }, ctx);
    }

    await repository.delete(modelId);

    return onNoContent(ctx);
  }

  async checkIfModelExistsById(modelId) {
    const model = await repository.getById(modelId);
    return !!model;
  }

  async checkIfModelExistsByName(modelName) {
    const model = await repository.getByName(modelName);
    return !!model;
  }

  async checkIfModelExistsByBrandId(brandId) {
    const model = await repository.getByBrandId(brandId);
    return !!model;
  }
}

module.exports = new ModelService();
