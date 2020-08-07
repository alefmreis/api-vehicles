const { Model, DataTypes } = require('sequelize');
const database = require('../../_shared/database/postgres');

class Brand extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING
    },
    {
      sequelize: connection
    });
  }
}

Brand.init(database.conn);

module.exports.Brand = Brand;
