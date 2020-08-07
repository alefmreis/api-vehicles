const { Model, DataTypes } = require('sequelize');
const database = require('../_shared/database/postgres');

class Models extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING
    },
    {
      sequelize: connection
    });
  }

  static associate(connection) {
    this.belongsTo(connection.models.Brand, { foreignKey: 'brand_id', as: 'brand' });
  }

}

Models.init(database.conn);
Models.associate(database.conn);

module.exports.Model = Models;
