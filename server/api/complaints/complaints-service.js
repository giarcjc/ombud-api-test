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
   * Gets document counts of product types filtered by query
   * @param {object} query - state or company (required)
   * @param {number} limit - limit results (optional)
   * @param {boolean} count - modify request to only get the count of results v
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
   * @param {number} limit - limit results (optional)
   * @param {boolean} count - modify request to only get the count of results (optional)
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
   * Gets document counts of all states in which consumers complained, filtered by query
   * @param {object} query - state or company (required)
   * @param {number} limit - limit results (optional)
   * @param {boolean} count - modify request to only get the count of results (optional)
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

  /**
   * Gets document counts of all states in which consumers complained,
   * @param {number} limit - limit results (optional)
   * @param {boolean} count - modify request to only get the count of results (optional)
   */
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

  /**
   * Get all complaints filtered by must and filter query params
   * @param {number} limit limit results (optional)
   * @param {boolean} count - modify request to only get the count of results (optional)
   */
  getComplaints: async (must, filter, limit, count) => {
    optionPartial.url = `${url}_search`;
    const esReqBody = {
      query: {
        bool: {
          must,
          filter,
        },
      },
    };

    if (limit) {
      Object.assign(esReqBody, { size: limit });
    }

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);

    try {
      const data = await rp(options);
      if (count) {
        return utils.getResultCount(data);
      }
      return utils.extractSearchData(data);
    } catch (err) {
      throw err;
    }
  },

  /**
   * @param {number} id - the complaint_id of the record to return(reuired)
   */
  getComplaintsById: async (id) => {
    optionPartial.url = `${url}_search`;

    const esReqBody = {
      query: {
        match: {
          complaint_id: id,
        },
      },
    };

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);

    try {
      const data = await rp(options);
      return utils.extractSearchData(data);
    } catch (err) {
      throw err;
    }
  },

};

module.exports = complaintsService;
