module.exports = {
  baseApi: 'api',
  authentication: {
    username: process.env.ADMIN_USERNAME || 'username',
    password: process.env.ADMIN_PASSWORD || 'password'
  },
  postgres: {
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT
  },
  port: process.env.PORT
}