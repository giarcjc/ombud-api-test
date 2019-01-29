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

module.exports = {
  handleProducts,
  handleStates,
};
