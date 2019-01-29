const proxyquire = require('proxyquire').noCallThru();

const app = proxyquire('../../server/app', {});

function getMockedApp() {
  return app;
}
module.exports = {
  getMockedApp,
};
