const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const wtf = require('wtfnode');
const utils = require('../../../server/utils');

const { expect } = chai;
chai.use(sinonChai);

describe('Population Service', () => {
  let sandbox;
  let populationService;
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

    populationService = proxyquire('../../../server/api/population/population-service', {
      'request-promise': (requestStub = sandbox.stub().resolves({})),
      '../../db/connection': mockConnection,
    });
  });

  const mockUrl = 'http://dummyhost:1234/cities/population/';

  afterEach(() => {
    sandbox.restore();
    wtf.dump();
  });

  describe('sortByPopulationResults', () => {
    it('should sort the population results by largest population change to smallest', () => {

    });

    it('should sort the population results by largest population rate change to smallest rate change', () => {

    });
  });

  describe('getPopulationGrowthEstimateForTimePeriod', () => {
    it('should query db to retrieve estimated population change for all states in date range', async () => {
      const dateRange = {
        fromYear: 2010,
        toYear: 2017,
      };

      const scriptedMetric = {
        init_script: 'state.transactions = []',
        map_script: `state.transactions.add(doc["POPESTIMATE${dateRange.toYear}"].value - doc["POPESTIMATE${dateRange.fromYear}"].value)`,
        combine_script: 'double foo = 0; for (t in state.transactions) { foo += t } return foo',
        reduce_script: 'double profit = 0; for (a in states) { profit += a } return profit',
      };

      const expectedESReqBody = {
        size: 0,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state_id',
              size: 51,
            },
            aggs: {
              populationChange: {
                scripted_metric: scriptedMetric,
              },
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await populationService.getPopulationGrowthEstimateForTimePeriod(dateRange);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to retrieve estimated population change for all states in date range with optional limit param', async () => {
      const dateRange = {
        fromYear: 2010,
        toYear: 2017,
      };

      const scriptedMetric = {
        init_script: 'state.transactions = []',
        map_script: `state.transactions.add(doc["POPESTIMATE${dateRange.toYear}"].value - doc["POPESTIMATE${dateRange.fromYear}"].value)`,
        combine_script: 'double foo = 0; for (t in state.transactions) { foo += t } return foo',
        reduce_script: 'double profit = 0; for (a in states) { profit += a } return profit',
      };

      const expectedESReqBody = {
        size: 0,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state_id',
              size: 51,
            },
            aggs: {
              populationChange: {
                scripted_metric: scriptedMetric,
              },
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await populationService.getPopulationGrowthEstimateForTimePeriod(dateRange, undefined, 12);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should query db to retrieve estimated population rate change for all states in date range with optional rate param', async () => {
      const dateRange = {
        fromYear: 2010,
        toYear: 2017,
      };

      const rate = true;

      const scriptedMetricForRate = {
        init_script: 'state.transactions = []',
        map_script: `float foo = doc["POPESTIMATE${dateRange.toYear}"].value - doc["POPESTIMATE${dateRange.fromYear}"].value; state.transactions.add(foo / doc["POPESTIMATE${dateRange.fromYear}"].value)`,
        combine_script: 'float increase = 0; for (t in state.transactions) { increase += t * 100 } return increase',
        reduce_script: 'float increase = 0; for (a in states) { increase += a } return increase',
      };

      const expectedESReqBody = {
        size: 0,
        aggs: {
          state_bucket: {
            terms: {
              field: 'state_id',
              size: 51,
            },
            aggs: {
              populationChange: {
                scripted_metric: scriptedMetricForRate,
              },
            },
          },
        },
      };

      sandbox.stub(utils, 'extractAggregationData').returns([]);
      const options = { url: `${mockUrl}_search`, json: true, body: expectedESReqBody };
      await populationService.getPopulationGrowthEstimateForTimePeriod(dateRange, rate);
      requestStub.should.have.been.calledOnce.and.calledWith(options);
    });

    it('should throw error if invalid date range', async () => {
      try {
        await populationService.getPopulationGrowthEstimateForTimePeriod();
      } catch (err) {
        expect(err).to.include(new Error('Invalid date range. Please check input parameters for fromYear and toYear.'));
      }
    });
  });
});
