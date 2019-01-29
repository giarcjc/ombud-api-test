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

describe('Complaints endpoints', () => {
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

  it('should be able to GET api/v1/complaints', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints?limit=50', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints?limit=50')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints?count=true', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints?count=true')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/products', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/products')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/products?limit=5', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/products?limit=5')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/products?count=true', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/products?count=true')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/states', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/states')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/states?limit=5', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/states?limit=5')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/complaints/states?count=true', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/complaints/states?count=true')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });
});
