const complaintsService = require('./complaints-service');

function handleProducts(req, res, next) {
  const {
    state, company, limit, count,
  } = req.query;

  if (state || company) {
    const query = state ? { state } : { company };
    complaintsService.getProductsByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  } else {
    complaintsService.getProducts(limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }
}

function handleStates(req, res, next) {
  const {
    company, productId, limit, count,
  } = req.query;
  if (company && productId) {
    // const query = company ? { company } : { product_id: productId };
    // complaintsService.getStatesByQuery(query, limit, count)
    //   .then(result => res.json(result))
    //   .catch(err => next(err));
  }
  if (company || productId) {
    const query = company ? { company } : { product_id: productId };
    complaintsService.getStatesByQuery(query, limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  } else {
    complaintsService.getStates(limit, count)
      .then(result => res.json(result))
      .catch(err => next(err));
  }
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
