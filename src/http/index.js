const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const {
  routeNotFoundHandler,
  errorHandler,
} = require('./middleware/error');

const {
  web3DecoratorHandler
} = require('./middleware/web3');

const roomBookingRouter = require('./router/roomBooking')

module.exports.newServer = (web3, { port, host, env }) => {
  const app = express();
  http.Server(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(web3DecoratorHandler(web3));

  app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/roomBooking', roomBookingRouter);

  // catch 404 and forward to error handler
  app.use(routeNotFoundHandler);
  // error handler
  app.use(errorHandler);

  app.set('port', port);
  app.set('host', host);
  app.set('env', env);

  return app;
};
