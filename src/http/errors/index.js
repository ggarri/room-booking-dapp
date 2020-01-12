/**
 * User: ggarrido
 * Date: 12/01/20 3:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

/**
 * InvalidRequestErrorCode
 */
const InvalidRequestErrorCode = module.exports.InvalidRequestErrorCode = 'INVALID_REQUEST';
module.exports.InvalidRequestError = (errMsg) => {
  const err = new Error(errMsg);
  err.code = InvalidRequestErrorCode;
  return err;
}

/**
 * RouteNotFound
 */
const RouteNotFoundErrorCode = module.exports.RouteNotFoundErrorCode = 'ROUTE_NOT_FOUND';
module.exports.RouteNotFoundError = (req) => {
  const err = new Error(`${req.method}: ${req.originalUrl}`);
  err.code = RouteNotFoundErrorCode;
  err.status = 404;
  return err;
}


