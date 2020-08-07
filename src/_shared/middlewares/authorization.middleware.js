const { onUnauthorized, onBadRequest } = require('../helpers/response-handler.helper');
const env = require('../application.environment');

class AuthorizationMiddleware {
  async isLoggedIn(ctx, next) {
    const { authorization } = ctx.request.headers;

    if (!authorization) {
      return onUnauthorized({ message: 'Missing Authorization Header' }, ctx);
    }

    const [basicType, basicToken] = authorization.split(' ');

    if (!basicType || basicType !== 'Basic' || !basicToken) {
      return onBadRequest({ message: 'Bad Authentication' }, ctx);
    }

    const credentials = Buffer.from(basicToken, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== env.authentication.username || password !== env.authentication.password) {
      return onUnauthorized({ message: 'You do not have access to this resource' }, ctx);
    }

    return next();

  }
}

module.exports = new AuthorizationMiddleware();