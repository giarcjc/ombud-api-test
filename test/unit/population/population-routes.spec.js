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

describe('Population endpoints', () => {
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

  it('should be able to GET api/v1/population/growth', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/population/growth')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });


  it('should be able to GET api/v1/population/growth?fromYear=[year]', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/population/growth?fromYear=2015')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/population/growth?toYear=[year]', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/population/growth?toYear=2015')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/population/growth?fromYear=[year]&toYear=[year]', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/population/growth?fromYear=2014&toYear=2015')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });

  it('should be able to GET api/v1/population/growth?rate=true', (done) => {
    request = chai
      .request(app)
      .get('/api/v1/population/growth?rate=true')
      .end((err, res) => {
        res.should.have.status(200);
        expect(err).to.equal(null);
        done();
      });
  });
});
