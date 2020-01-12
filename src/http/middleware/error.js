/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { failedJsonResponse } = require('../response');
const { RouteNotFoundError } = require('../errors')

module.exports.routeNotFoundHandler = (req, res, next) => {
  next(RouteNotFoundError());
};

module.exports.errorHandler = (err, req, res) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const status = err.status || 500;
  res.status(status);

  if (/json/.test(req.get('accept'))) {
    res.setHeader('Content-Type', 'application/json');
    res.json(failedJsonResponse(err.stack.split('\n'), status))
  } else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.render('error');
  }
};
