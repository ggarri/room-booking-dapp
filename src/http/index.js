const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const {
  routeNotFoundHandler,
  fallbackErrorHandler
} = require('./middleware/fallback');

const {
  web3PreHandler,
  web3PostHandler
} = require('./middleware/web3');

const roomBookingRouter = require('./router/roomBooking')

module.exports.newServer = (web3, { port, host, env }) => {
  const app = express();
  http.Server(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(web3PreHandler(web3));

  app.get('/hello', (req, res, next) => {
    res.send('Hello World!');
  });

  app.use('', roomBookingRouter, web3PostHandler(web3));

  // catch 404 and forward to error handler
  app.use(routeNotFoundHandler);
  // error handler
  app.use(fallbackErrorHandler);

  app.set('port', port);
  app.set('host', host);
  app.set('env', env);

  return app;
};
