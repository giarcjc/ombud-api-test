const rp = require('request-promise');
const connection = require('../../db/connection');
const logger = require('../../logger');
const utils = require('../../utils');

const { host, port, indices: { population } } = connection;

if (!host || !port || !population) {
  throw new Error('Missing config values!');
}
const url = `http://${host}:${port}/${population.index}/${population.type}/`;
const optionPartial = { url, json: true };

const populationService = {
  /**
   * helper function to sort population results
   * @param {array} dataArray - returned data
   */
  sortByPopulationResults: (dataArray, rate) => {
    if (!Array.isArray(dataArray)) {
      throw new Error(`Expected dataArray param to be an Array but it is actually a ${typeof dataArray}`);
    }

    let sortFunction;

    if (rate) {
      sortFunction = (a, b) => Math.abs(b.populationChange) - Math.abs(a.populationChange);
    } else {
      sortFunction = (a, b) => b.populationChange - a.populationChange;
    }

    return dataArray
      .filter(i => i.key !== 'district_of_columbia') // * Remove when data is cleaned up
      .filter((i) => {
        const state = i;
        state.populationChange = i.populationChange.value;
        return state;
      }).sort(sortFunction);
  },

  /**
   * gets estimated population growth
   * @param {object} dateRange - query range
   * @param {object} dateRange.fromYear - first year to evaluate
   * @param {object} dateRange.toYear - last year to evaluate
   * @param {boolean} rate - return results as percentage of growth
   * @param {number} limit - modify request to only get the count of results
   */
  getPopulationGrowthEstimateForTimePeriod: async (dateRange, rate, limit) => {
    let scriptedMetric;

    if (!dateRange || !dateRange.fromYear || !dateRange.toYear) {
      throw new Error('Invalid date range. Please check input parameters for fromYear and toYear.');
    }

    const { fromYear, toYear } = dateRange;

    if (rate) {
      scriptedMetric = {
        init_script: 'state.transactions = []',
        map_script: `float foo = doc["POPESTIMATE${toYear}"].value - doc["POPESTIMATE${fromYear}"].value; state.transactions.add(foo / doc["POPESTIMATE${fromYear}"].value)`,
        combine_script: 'float increase = 0; for (t in state.transactions) { increase += t * 100 } return increase',
        reduce_script: 'float increase = 0; for (a in states) { increase += a } return increase',
      };
    } else {
      scriptedMetric = {
        init_script: 'state.transactions = []',
        map_script: `state.transactions.add(doc["POPESTIMATE${toYear}"].value - doc["POPESTIMATE${fromYear}"].value)`,
        combine_script: 'double foo = 0; for (t in state.transactions) { foo += t } return foo',
        reduce_script: 'double profit = 0; for (a in states) { profit += a } return profit',
      };
    }

    optionPartial.url = `${url}_search`;

    const esReqBody = {
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

    const options = Object.assign(optionPartial, { body: esReqBody });
    logger.debug(options);

    try {
      const data = await rp(options);
      const result = utils.extractAggregationData(data, 'state_bucket');
      return utils.limitResults(populationService.sortByPopulationResults(result, rate), limit);
    } catch (err) {
      throw err;
    }
  },

  getPopulation: async (city, limit, count) => {
    let esReqBody = {};

    if (city) {
      esReqBody = {
        query: { match_phrase: { CITY: city } },
      };
    }


    if (limit) {
      Object.assign(esReqBody, { size: limit });
    }

    optionPartial.url = `${url}_search`;
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
};

module.exports = populationService;
