const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const wtf = require('wtfnode');

const { expect } = chai;
chai.should();

chai.use(chaiHttp);
chai.use(sinonChai);

const app = require('../../support/utils').getMockedApp();

describe('Status endpoint', () => {
  let request;
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    request.app.close();
  });

  after(() => {
    sandbox.restore();
    wtf.dump();
  });

  it('should be able to GET api/v1/status', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/status')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });
});
