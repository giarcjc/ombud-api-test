const rp = require('request-promise');
const connection = require('../../db/connection');
const logger = require('../../logger');
const utils = require('../../utils');

const { host, port, indices: { consumers } } = connection;

if (!host || !port || !consumers) {
  throw new Error('Missing config values!');
}

const url = `http://${host}:${port}/${consumers.index}/${consumers.type}/`;
const optionPartial = { url, json: true };

const complaintsService = {

  /**
   * return count of docs that match query
   * @param {object} query - optional query to perform
   */
  getCount: async (query) => {
    const options = Object.assign({}, { uri: `${url}_count` }, { json: true });

    if (query) {
      const esReqBody = {
        query: {
          match_phrase: query,
        },
      };
      Object.assign(options, { body: esReqBody });
    }

    logger.debug(options);
    const result = await rp(options);
    return result.count;
  },


  /**
   * helper function to destructure returned data
   * @param {object} data - returned data
   */
  extractSearchData(data) {
    const { hits: { hits } } = data;
    return hits.map((hit) => {
      const { _source = {} } = hit;
      return _source;
    });
  },

  /**
   * Gets document counts of product types filtered by query
   * @param {object} query - state or company
   * @param {number} limit - limit results
   * @param {boolean} count - modify request to only get the count of results
  */
  getProductsByQuery: async (query, limit, count) => {
    if (count) {
      return complaintsService.getCount(query);
    }

    optionPartial.url = `${url}_search`;
    const esReqBody = {
      size: 0,
      query: {
        match_phrase: query,
      },
      aggs: {
        product_bucket: {
          terms: {
            field: 'product_id',
          },
        },
      },
    };

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);

    try {
      const data = await rp(options);
      const result = utils.extractAggregationData(data, 'product_bucket');
      return utils.limitResults(result, limit);
    } catch (err) {
      throw err;
    }
  },

  /**
   * Gets document counts of product types for which consumers complained
   * @param {number} limit - limit results
   * @param {boolean} count - modify request to only get the count of results
  */
  getProducts: async (limit, count) => {
    if (count) {
      return complaintsService.getCount();
    }

    optionPartial.url = `${url}_search`;

    const esReqBody = {
      size: 0,
      aggs: {
        product_bucket: {
          terms: {
            field: 'product_id',
          },
        },
      },
    };

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);
    try {
      const data = await rp(options);
      const result = utils.extractAggregationData(data, 'product_bucket');
      return utils.limitResults(result, limit);
    } catch (err) {
      throw err;
    }
  },

  /**
   * Gets document counts of all states types filtered by query
   * @param {object} query - state or company
   * @param {number} limit - limit results
   * @param {boolean} count - modify request to only get the count of results
  */
  getStatesByQuery: async (query, limit, count) => {
    if (count) {
      return complaintsService.getCount(query);
    }

    optionPartial.url = `${url}_search`;
    const esReqBody = {
      size: 0,
      query: {
        match_phrase: query,
      },
      aggs: {
        state_bucket: {
          terms: {
            field: 'state',
            size: 51,
          },
        },
      },
    };

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);

    try {
      const data = await rp(options);
      const result = utils.extractAggregationData(data, 'state_bucket');
      return utils.limitResults(result, limit);
    } catch (err) {
      throw err;
    }
  },

  getStates: async (limit, count) => {
    if (count) {
      return complaintsService.getCount();
    }

    optionPartial.url = `${url}_search`;

    const esReqBody = {
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

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);
    try {
      const data = await rp(options);
      const result = utils.extractAggregationData(data, 'state_bucket');
      return utils.limitResults(result, limit);
    } catch (err) {
      throw err;
    }
  },

  // Not implemented yet...
  // getComplaints: (limit) => {
  //   const result = complaintsService.extractSearchData(data);
  //   return complaintsService.limitResults(result, limit);
  // },

};

module.exports = complaintsService;
