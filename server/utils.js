const utils = {
  /**
   * helper function to destructure returned data
   * @param {object} data - returned data
   * @param {string} bucketName - the aggregation bucket name
   */
  extractAggregationData: (data, bucketName) => {
    // destructure bucket or return default empty object
    const { aggregations: { [bucketName]: { buckets } = [] } } = data;
    return buckets;
  },

  /**
   * helper function to limit returned results
   * @param {array} dataArray - returned data
   * @param {number} limit - number of results to return
   */
  limitResults: (dataArray, limit) => {
    if (!Array.isArray(dataArray)) {
      throw new Error(`Expected dataArray param to be an Array but it is actually a ${typeof dataArray}`);
    }
    if (limit) {
      return dataArray.slice(0, limit);
    }
    return dataArray;
  },
};

module.exports = utils;
