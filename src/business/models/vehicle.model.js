const { Model, DataTypes } = require('sequelize');
const database = require('../../_shared/database/postgres');

class Vehicle extends Model {
  static init(connection) {
    super.init({
      value: DataTypes.STRING,
      year_model: DataTypes.INTEGER,
      fuel: DataTypes.STRING
    },
    {
      sequelize: connection
    });
  }

  static associate(connection) {
    this.belongsTo(connection.models.Brand, { foreignKey: 'brand_id', as: 'brand' });
    this.belongsTo(connection.models.Models, { foreignKey: 'model_id', as: 'model' });
  }
}

Vehicle.init(database.conn);
Vehicle.associate(database.conn);

module.exports.Vehicle = Vehicle;
