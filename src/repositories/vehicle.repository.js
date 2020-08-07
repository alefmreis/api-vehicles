const { Vehicle } = require('../business/models/vehicle.model');
const database = require('../_shared/database/postgres');

class VehicleRepository {
  count(modelId) {
    const query = {};

    if (modelId) {
      query.model_id = modelId;
    }
    return Vehicle.count({ where: query });
  }

  getPaged(pageSkip, pageLimit, modelId) {
    const query = {};

    if (modelId) {
      query.model_id = modelId;
    }

    return Vehicle.findAll({
      where: query,
      order: [['value', 'ASC']],
      include: [
        {
          model: database.conn.models.Brand,
          as: 'brand',
          attributes: ['id', 'name']
        },
        {
          model: database.conn.models.Models,
          as: 'model',
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'value', 'year_model', 'fuel'],
      limit: pageLimit,
      offset: pageSkip
    });
  }

  getById(vehicleId) {
    return Vehicle.findOne({ where: { id: vehicleId } });
  }

  create(vehicle) {
    return Vehicle.create(vehicle);
  }

  update(vehicleId, vehicle) {
    return Vehicle.update(
      vehicle,
      {
        where: { id: vehicleId },
        returning: true
      }
    );
  }

  delete(vehicleId) {
    return Vehicle.destroy({ where: { id: vehicleId } });
  }
}

module.exports = new VehicleRepository();
