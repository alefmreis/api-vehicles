const env = require('../application.environment');

module.exports = {
  dialect: 'postgres',
  host: env.postgres.host,
  username: env.postgres.username,
  password: env.postgres.password,
  database: (process.env.NODE_ENV === 'test') ? 'postgres_database_test' : env.postgres.database,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: process.env.NODE_ENV !== 'test'
  }
};
