const { onSuccess, onBadRequest, onNotFound, onUnprocessableEntity, onCreated, onConflict, onUpdated, onNoContent } = require('../_shared/helpers/response-handler.helper');
const repository = require('../repositories/brand.repository');
const check = require('check-types');
const pagingHelper = require('../_shared/helpers/paging.helper');
const brandFluentValidate = require('../business/fluent-validators/brand.fluent-validator');

class BrandService {
  async getPagedResponse(pageOffset, pageLimit, ctx) {
    if (isNaN(pageOffset) || !check.integer(parseInt(pageOffset, 10))) {
      return onBadRequest({ message: 'Offset must be an integer' }, ctx)
    }

    if (isNaN(pageLimit) || !check.integer(parseInt(pageLimit, 10))) {
      return onBadRequest({ message: 'Limit must be an integer' }, ctx)
    }

    if (pageLimit < 1 || pageLimit > 50) {
      return onBadRequest({ message: 'Limit must be greater than zero and less than fifty' }, ctx)
    }

    const totalBrands = await repository.count();
    const brands = await repository.getPaged(pageOffset, pageLimit);

    return onSuccess(pagingHelper(pageOffset, pageLimit, totalBrands), brands, ctx);
  }

  async getById(brandId) {
    return repository.getById(brandId);
  }

  async getByIdResponse(brandId, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const brand = await repository.getById(parseInt(brandId, 10));

    if (!brand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    return onSuccess({}, brand, ctx);
  }

  async createResponse(brand, ctx) {
    const resultValidator = brandFluentValidate(brand);

    if (resultValidator.length > 0) {
      return onUnprocessableEntity(resultValidator, ctx);
    }

    const existentBrand = await repository.getByName(brand.name);

    if (existentBrand) {
      return onConflict({ message: `Brand ${brand.name} already exists` }, ctx);
    }

    const newBrand = await repository.create(brand);

    return onCreated(newBrand, ctx);
  }

  async updateResponse(brandId, brand, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const resultValidator = brandFluentValidate(brand);

    if (resultValidator.length > 0) {
      return onUnprocessableEntity(resultValidator, ctx);
    }

    const existentBrand = await repository.getById(parseInt(brandId, 10));

    if (!existentBrand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    const existentBrandByName = await repository.getByName(brand.name);

    if (existentBrandByName) {
      return onConflict({ message: `Brand ${brand.name} already exists` }, ctx);
    }

    const [n, updatedBrand] = await repository.update(brandId, brand);

    return onUpdated(updatedBrand[n - 1], ctx);
  }

  async deleteResponse(brandId, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const brand = await repository.getById(parseInt(brandId, 10));

    if (!brand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    const modelService = require('./model.service');
    const model = await modelService.getByBrandId(brandId);

    if (model) {
      return onConflict({ message: `You can not delete this brand ${brandId} because there is a model registered with this brand` }, ctx);
    }

    await repository.delete(brandId);

    return onNoContent(ctx);
  }
}

module.exports = new BrandService();
