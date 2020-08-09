const { onSuccess, onBadRequest, onNotFound, onUnprocessableEntity, onCreated, onConflict, onUpdated, onNoContent } = require('../_shared/helpers/response-handler.helper');
const repository = require('../repositories/brand.repository');
const check = require('check-types');
const pagingHelper = require('../_shared/helpers/paging.helper');
const brandFluentValidate = require('../business/fluent-validators/brand.fluent-validator');

class BrandService {
  async getPaged(pageOffset, pageLimit, ctx) {
    if (!check.integer(parseInt(pageOffset, 10)) || !check.integer(parseInt(pageLimit, 10))) {
      return onBadRequest({ message: 'offset and limit must be an integer' }, ctx);
    }

    const totalBrands = await repository.count();
    const brands = await repository.getPaged(pageOffset, pageLimit);

    return onSuccess(pagingHelper(pageOffset, pageLimit, totalBrands), brands, ctx);
  }

  async getById(brandId, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const brand = await repository.getById(parseInt(brandId, 10));

    if (!brand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    return onSuccess({}, brand, ctx);
  }

  async create(brand, ctx) {
    const validator = brandFluentValidate(brand);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const existentBrand = await this.checkIfBrandExistsByName(brand.name);

    if (existentBrand) {
      return onConflict({ message: `Brand ${brand.name} already exists` }, ctx);
    }

    const newBrand = await repository.create(brand);

    return onCreated(newBrand, ctx);
  }

  async update(brandId, brand, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const validator = brandFluentValidate(brand);

    if (validator.length > 0) {
      return onUnprocessableEntity(validator, ctx);
    }

    const existentBrand = await this.checkIfBrandExistsById(parseInt(brandId, 10));

    if (!existentBrand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    const existentBrandByName = await this.checkIfBrandExistsByName(brand.name);

    if (existentBrandByName) {
      return onConflict({ message: `Brand ${brand.name} already exists` }, ctx);
    }

    const [n, updatedBrand] = await repository.update(brandId, brand);

    return onUpdated(updatedBrand[n - 1], ctx);
  }

  async delete(brandId, ctx) {
    if (!check.integer(parseInt(brandId, 10))) {
      return onBadRequest({ message: 'Brand id must be an integer' }, ctx);
    }

    const brand = await this.checkIfBrandExistsById(parseInt(brandId, 10));

    if (!brand) {
      return onNotFound({ message: `Brand ${brandId} not found` }, ctx);
    }

    const modelService = require('./model.service');
    const model = await modelService.checkIfModelExistsByBrandId(brandId);

    if (model) {
      return onConflict({ message: `You can not delete this brand ${brandId} because there is a model registered with this brand` }, ctx);
    }

    await repository.delete(brandId);

    return onNoContent(ctx);
  }

  async checkIfBrandExistsById(brandId) {
    const brand = await repository.getById(brandId);
    return !!brand;
  }

  async checkIfBrandExistsByName(brandName) {
    const brand = await repository.getByName(brandName);
    return !!brand;
  }
}

module.exports = new BrandService();
