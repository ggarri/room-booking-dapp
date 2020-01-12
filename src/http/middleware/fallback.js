/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { failedJsonResponse } = require('../response');
const { RouteNotFoundError } = require('../errors')

module.exports.routeNotFoundHandler = (req, res, next) => {
  const err = RouteNotFoundError(req);
  res.status(404);
  res.setHeader('Content-Type', 'application/json');
  res.send(failedJsonResponse(err.message, err.code))
};

module.exports.fallbackErrorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(err);
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.json(failedJsonResponse(err.message, status))
};
