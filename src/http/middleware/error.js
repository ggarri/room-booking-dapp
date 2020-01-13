/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Debug = require('debug');
const { failedJsonResponse } = require('../response');
const { RouteNotFoundError } = require('../errors')

const loggerErr = Debug('app:http:err');

module.exports.noRouteErrHandler = (req, res, next) => {
  const err = RouteNotFoundError(req);
  res.status(404);
  res.setHeader('Content-Type', 'application/json');
  res.send(failedJsonResponse(err.message, err.code));
  loggerErr(err);
};

module.exports.fallbackErrHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.json(failedJsonResponse(err.message, status));
  loggerErr(err);
};
