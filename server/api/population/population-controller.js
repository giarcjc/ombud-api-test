const populationService = require('./population-service');
const constants = require('../../constants');

function handleGrowth(req, res, next) { // ewww...?
  const {
    fromYear,
    toYear,
    rate,
    limit,
  } = req.query;

  const dateRange = {
    fromYear: fromYear || constants.FIRST_YEAR_OF_POPULATION_DATASET,
    toYear: toYear || constants.LAST_YEAR_OF_POPULATION_DATASET,
  };

  populationService.getPopulationGrowthEstimateForTimePeriod(dateRange, rate, limit)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function handlePopulation(req, res, next) {
  const { city, limit, count } = req.query;
  populationService.getPopulation(city, limit, count)
    .then(result => res.json(result))
    .catch(err => next(err));
}

module.exports = {
  handlePopulation,
  handleGrowth,
};
