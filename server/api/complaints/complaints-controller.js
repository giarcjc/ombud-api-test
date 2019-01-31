const complaintsService = require('./complaints-service');
const logger = require('../../logger');

function handleProducts(req, res, next) {
  let query;

  const {
    state, company, limit, count,
  } = req.query;

  if (state && state.length > 2) {
    logger.warn('State Param provided but length exceeded expected number of characters.  State param should 2 char max, e.g "NY" instead of "New York". See api docs for more examples.');
  }

  if (company && state) {
    query = {
      bool: {
        must: [
          { match_phrase: { company } },
          { match: { state } },
        ],
      },
    };
    return complaintsService.getProductsByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }
  if (state || company) {
    const match = state ? { state } : { company };
    query = {
      match_phrase: match,
    };
    return complaintsService.getProductsByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }

  return complaintsService.getProducts(limit, count)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function handleStates(req, res, next) {
  let query;

  const {
    company, productId, limit, count,
  } = req.query;

  if (company && productId) {
    query = {
      bool: {
        must: [
          { match_phrase: { company } },
          { match: { product_id: productId } },
        ],
      },
    };
    return complaintsService.getStatesByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }
  if (company || productId) {
    const match = company ? { company } : { product_id: productId };
    query = {
      match_phrase: match,
    };
    return complaintsService.getStatesByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }

  return complaintsService.getStates(limit, count)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function handleComplaints(req, res, next) {
  const {
    company, state, productId, limit, count,
  } = req.query;

  const must = [];
  let match;
  let matchPhrase;
  let filter;

  if (company) {
    matchPhrase = {
      match_phrase: { company },
    };
    must.push(matchPhrase);
  }

  if (state) {
    match = {
      match: { state },
    };
    must.push(match);
  }

  if (productId) {
    filter = [
      {
        term: { product_id: productId },
      },
    ];
  }

  complaintsService.getComplaints(must, filter, limit, count)
    .then(result => res.json(result))
    .catch(err => next(err));
}

function handleAComplaintById(req, res, next) {
  if (!req.params.id) {
    throw new Error('Missing required param: id');
  }
  const companyId = +req.params.id;

  if (Number.isNaN(companyId)) {
    throw new Error('Invalid Parameter. Please check the api documentation and try again.');
  }
  complaintsService.getComplaintsById(req.params.id)
    .then(result => res.json(result))
    .catch(err => next(err));
}

module.exports = {
  handleComplaints,
  handleAComplaintById,
  handleProducts,
  handleStates,
};
