const { Brand } = require('../business/models/brand.model');

class BrandRepository {
  count(query = {}) {
    return Brand.count({ where: query });
  }

  getPaged(offset, limit) {
    return Brand.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
      limit,
      offset
    });
  }

  getById(brandId) {
    return Brand.findOne({ where: { id: brandId } });
  }

  getByName(brandName) {
    return Brand.findOne({ where: { name: brandName } });
  }

  create(brand) {
    return Brand.create(brand);
  }

  update(brandId, brand) {
    return Brand.update(
      brand,
      {
        where: { id: brandId },
        returning: true
      }
    );
  }

  delete(brandId) {
    return Brand.destroy({ where: { id: brandId } });
  }
}

module.exports = new BrandRepository();
