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


  /**
   * helper function to destructure returned count of data
   * @param {object} data - initial returned data
   */
  getResultCount(data) {
    const { hits: { total } } = data;
    return total;
  },

  /**
   * helper function to destructure returned data
   * @param {object} data - initial returned data
   */
  extractSearchData(data) {
    const { hits: { hits } } = data;
    return hits.map((hit) => {
      const { _source = {} } = hit;
      return _source;
    });
  },

};

module.exports = utils;
