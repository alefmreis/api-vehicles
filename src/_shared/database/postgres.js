const dbConfig = require('./postgres.config');
const Sequelize = require('sequelize');

class Database {
  static get conn() {
    if (!Database.connection) {
      throw new Error('Database is not connected!');
    }

    return Database.connection;
  }

  static connect() {
    Database.connection = new Sequelize(dbConfig);
  }
}

module.exports = Database;
