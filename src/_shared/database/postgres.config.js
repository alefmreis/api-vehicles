const env = require('../application.environment');

module.exports = {
  dialect: 'postgres',
  host: (process.env.NODE_ENV === 'test') ? '127.0.0.1' : env.postgres.host,
  username: (process.env.NODE_ENV === 'test') ? 'postgres_username' : env.postgres.username,
  password: (process.env.NODE_ENV === 'test') ? 'postgres_password' : env.postgres.password,
  database: (process.env.NODE_ENV === 'test') ? 'postgres_database_test' : env.postgres.database,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: process.env.NODE_ENV !== 'test'
  }
};
