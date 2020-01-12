/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */


module.exports.web3DecoratorHandler = (web3) => (req, res, next) => {
  req.web3 = {
    engine: web3,
    defaultAddress: '0x'
  };

  next();
};
