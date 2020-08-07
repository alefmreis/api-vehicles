const env = require('../application.environment');
const Sequelize = require('sequelize');

class Database {
  static get conn() {
    if (!Database.connection) {
      throw new Error('Database is not connected!');
    }

    return Database.connection;
  }

  static connect() {
    Database.connection = new Sequelize(`postgres://${env.postgres.username}:${env.postgres.password}@${env.postgres.host}:${env.postgres.port}/${env.postgres.database}`, {
      define: {
        underscored: true,
        timestamps: true,
        paranoid: true
      }
    });
  }
}

module.exports = Database;
