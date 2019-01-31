const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const wtf = require('wtfnode');
const utils = require('../../../server/utils');

chai.use(sinonChai);

describe('Complaints Service', () => {
  let sandbox;
  let complaintsService;
  let requestStub;
  let mockConnection;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockConnection = {
      host: 'dummyhost',
      port: 1234,
      indices: {
        population: {
          index: 'cities',
          type: 'population',
        },
        consumers: {
          index: 'consumers',
          type: 'complaints',
        },
      },
    };

    complaintsService = proxyquire('../../../server/api/complaints/complaints-service', {
      'request-promise': (requestStub = sandbox.stub().resolves({})),
      '../../db/connection': mockConnection,
    });
  });

  const mockUrl = 'http://dummyhost:1234/consumers/complaints/';

  afterEach(() => {
    sandbox.restore();
    wtf.dump();
  });

  describe('getCount', () => {
    it('should return count of all docs that match query', async () => {
      const query = {
        match_phrase: { foo: 'bar' },
      };
      const expectedESReqBody = { query };
      const options = { uri: `${mockUrl}_count`, json: true, body: expectedESReqBody };
      await complaintsService.getCount(query);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should return count of all docs if no query param', async () => {
      const options = { uri: `${mockUrl}_count`, json: true };
      await complaintsService.getCount();
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getProductsByQuery', () => {
    it('should query db to get document counts of all product groups for given state', async () => {
      const query = {
        match_phrase: {
          state: 'NY',
        },
      };
      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProductsByQuery(query);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });


    it('should query db to get document counts of all product groups for given state with optional limit param', async () => {
      const query = {
        match_phrase: {
          state: 'NY',
        },
      };
      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProductsByQuery(query, 3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all product groups for given state', async () => {
      const query = {
        match_phrase: {
          state: 'NY',
        },
      };
      const count = true;
      const expectedESReqBodyCount = {
        query,
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true, body: expectedESReqBodyCount };
      await complaintsService.getProductsByQuery(query, undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all product groups for given company', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };

      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProductsByQuery(query);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });


    it('should query db to get document counts of all product groups for given company with optional limit param', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };
      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProductsByQuery(query, 3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all products groups for given company', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };
      const count = true;
      const expectedESReqBodyCount = {
        query,
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true, body: expectedESReqBodyCount };
      await complaintsService.getProductsByQuery(query, undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getProducts', () => {
    it('should query db to get document counts of all products', async () => {
      const expectedESReqBody = {
        size: 0,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProducts();
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all products with optional limit param', async () => {
      const expectedESReqBody = {
        size: 0,
        aggs: {
          product_bucket: {
            terms: {
              field: 'product_id',
            },
          },
        },
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getProducts(3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all products', async () => {
      const count = true;
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true };
      await complaintsService.getProducts(undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getStatesByQuery', () => {
    it('should query db to get document counts of all state groups for given product_id', async () => {
      const query = {
        match_phrase: {
          product_id: 'mortgage',
        },
      };

      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStatesByQuery(query);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all state groups for given product_id with optional limit param', async () => {
      const query =  {
        match_phrase: {
          product_id: 'mortgage',
        },
      };

      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStatesByQuery(query, 3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all state groups for given product_id', async () => {
      const query = {
        match_phrase: {
          product_id: 'mortgage',
        },
      };

      const count = true;
      const expectedESReqBody = {
        query,
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true, body: expectedESReqBody };
      await complaintsService.getStatesByQuery(query, undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all product groups for given company', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };

      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStatesByQuery(query);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all product groups for given company with optional limit param', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };

      const expectedESReqBody = {
        size: 0,
        query,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStatesByQuery(query, 3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all products groups for given company', async () => {
      const query = {
        match_phrase: {
          company: 'Bank of America',
        },
      };

      const count = true;
      const expectedESReqBodyCount = {
        query,
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true, body: expectedESReqBodyCount };
      await complaintsService.getStatesByQuery(query, undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getStates', () => {
    it('should query db to get document counts of all states', async () => {
      const expectedESReqBody = {
        size: 0,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStates();
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get document counts of all states with optional limit param', async () => {
      const expectedESReqBody = {
        size: 0,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state',
              size: 51,
            },
          },
        },
      };
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getStates(3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to get count of all states', async () => {
      const count = true;
      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { uri: `${mockUrl}_count`, json: true };
      await complaintsService.getStates(undefined, count);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getComplaints', () => {
    it('should get all complaints without any params', async () => {
      const expectedESReqBody = {
        query: {
          bool: {
            filter: undefined, must: undefined,
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints();
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should get complaints with state param', async () => {
      const state = { state: 'NY' };
      const expectedESReqBody = {
        query: {
          bool: {
            filter: undefined, must: { state: 'NY' },
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints(state);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should get complaints with company param', async () => {
      const company = { company: 'wells fargo' };
      const expectedESReqBody = {
        query: {
          bool: {
            filter: undefined, must: { company: 'wells fargo' },
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints(company);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should get complaints with productId param', async () => {
      const productId = { product_id: 'credit_card' };
      const expectedESReqBody = {
        query: {
          bool: {
            filter: { product_id: 'credit_card' }, must: undefined,
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints(undefined, productId);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should get subset of complaints with limit param', async () => {
      const limit = 7;
      const expectedESReqBody = {
        size: 7,
        query: {
          bool: {
            filter: undefined, must: undefined,
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints(undefined, undefined, limit);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should get count of complaints with count param', async () => {
      const expectedESReqBody = {
        query: {
          bool: {
            filter: undefined, must: undefined,
          },
        },
      };

      sandbox.stub(utils, 'getResultCount').returns(53673);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaints(undefined, undefined, undefined, true);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });

  describe('getComplaintsById', () => {
    it('should get one complaint for a given id', async () => {
      const expectedESReqBody = {
        query: {
          match: {
            complaint_id: 3,
          },
        },
      };

      sandbox.stub(utils, 'extractSearchData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await complaintsService.getComplaintsById(3);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });
  });
});
