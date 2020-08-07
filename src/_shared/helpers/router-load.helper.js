const glob = require('glob');

class RouterLoaderHelper {
  constructor(server) {
    this.server = server;
  }

  load() {
    glob(`${__dirname}`.replace(/_shared.*/g, 'routes/*'), (err, routerPaths) => {
      if (err) {
        throw err;
      }
      routerPaths.forEach((routeFile) => {
        // eslint-disable-next-line import/no-dynamic-require
        const route = require(routeFile);
        this.server.use(route.routes());
      });
    });
  }
}

module.exports = RouterLoaderHelper;
