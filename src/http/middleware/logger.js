/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Debug = require('debug');
const logger = Debug('app:http');

module.exports.loggerHandler = (req, res, next) => {
  logger(`Request ${req.method} ${req.url}`);
  next();
};
