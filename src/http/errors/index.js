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

/**
 * Web3AuthError
 */
const Web3AuthErrorCode = module.exports.Web3AuthErrorCode = 'WEB3_AUTH_ERR';
module.exports.Web3AuthError = () => {
  const err = new Error(`Invalid or missing Basic-Auth headers`);
  err.code = Web3AuthErrorCode;
  err.status = 503;
  return err;
}
