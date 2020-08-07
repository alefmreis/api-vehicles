const { Model } = require('../business/models/model.model');

class ModelRepository {
  count(brandId) {
    const query = {};

    if (brandId) {
      query.brand_id = brandId;
    }

    return Model.count({ where: query });
  }

  getPaged(offset, limit, brandId) {
    const query = {};

    if (brandId) {
      query.brand_id = brandId;
    }

    return Model.findAll({
      where: query,
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
      limit,
      offset
    });
  }

  getById(modelId) {
    return Model.findOne({ where: { id: modelId } });
  }

  getByBrandId(brandId) {
    return Model.findOne({ where: { brand_id: brandId } });
  }

  getByName(modelName) {
    return Model.findOne({ where: { name: modelName } });
  }

  create(model) {
    return Model.create(model);
  }

  update(modelId, model) {
    return Model.update(
      model,
      {
        where: { id: modelId },
        returning: true
      }
    );
  }

  delete(modelId) {
    return Model.destroy({ where: { id: modelId } });
  }
}

module.exports = new ModelRepository();
