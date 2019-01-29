const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const utils = require('../../../server/utils');

chai.use(sinonChai);

describe('Utils', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('extractAggregationData', () => {
    it('should destructure returned aggregation data and return an array of objects', () => {
      const aggregationData = {
        hits: {
          total: 1491,
          max_score: 0,
          hits: [],
        },
        aggregations: {
          product_bucket: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'foo',
                doc_count: 3,
              },
              {
                key: 'bar',
                doc_count: 6,
              },
            ],
          },
        },
      };

      const expectedResult = [
        {
          key: 'foo',
          doc_count: 3,
        },
        {
          key: 'bar',
          doc_count: 6,
        },
      ];

      const result = utils.extractAggregationData(aggregationData, 'product_bucket');
      result.should.deep.equal(expectedResult);
    });
  });

  describe('limitResults', () => {
    it('should limit the returned results if a limit param is present', () => {
      const dataArray = ['a', 'b', 'c', 'd', 'e'];
      const result = utils.limitResults(dataArray, 3);
      result.should.deep.equal(['a', 'b', 'c']);
    });

    it('should return original array if no limit param is present', () => {
      const dataArray = ['a', 'b', 'c', 'd', 'e'];
      const result = utils.limitResults(dataArray);
      result.should.deep.equal(['a', 'b', 'c', 'd', 'e']);
    });

    it('should throw an error if dataArray param is not an array', () => {
      (() => utils.limitResults('dataArray', 3)).should.throw();
    });
  });
});
