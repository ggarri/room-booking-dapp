/**
 * User: ggarrido
 * Date: 12/01/20 2:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { InvalidRequestError } = require('../errors');

const extractRequestAttrs = module.exports.extractRequestAttrs = (req, query) => {
  const params = { ...req.body, ...req.query };
  return _.reduce(Object.keys(params), (result, key) => {
    if (query.indexOf(key) !== -1) {
      result[key] = params[key];
    }
    return result;
  }, {});
};

module.exports.validateRequestAttrs = (req, query) => {
  const attrs = extractRequestAttrs(req, query);
  for ( let i = 0; i < query.length; i++ ) {
    const param = query[i];
    if (!attrs[param]) {
      throw InvalidRequestError(`Missing query param: ${param}`);
    }
  }
};

//@TODO Complete impl
module.exports.extractWeb3FromAddr = (req) => {
  return req.web3.defaultAddress;
}

module.exports.extractWeb3Engine = (req) => {
  return req.web3.engine;
}
