const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const {
  noRouteErrHandler,
  fallbackErrHandler
} = require('./middleware/error');

const {
  web3Injector
} = require('./middleware/web3');

const {
  loggerHandler
} = require('./middleware/logger');

const roomBookingRouter = require('./router/roomBooking');

module.exports.newServer = (web3, { port, host, env }) => {
  const app = express();
  http.Server(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(web3Injector(web3));
  app.use(loggerHandler);

  app.use('', roomBookingRouter);

  // catch 404 and forward to error handler
  app.use(noRouteErrHandler);
  // error handler
  app.use(fallbackErrHandler);

  app.set('port', port);
  app.set('host', host);
  app.set('env', env);

  return app;
};
