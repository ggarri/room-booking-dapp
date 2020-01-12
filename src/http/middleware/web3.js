/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const get = require('lodash.get');
const Debug = require('debug');
const logger = Debug('app:http:middleware');
const loggerErr = Debug('app:http:middleware:err');

module.exports.web3PreHandler = (web3) => async (req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [ethAddress, password] = new Buffer.from(b64auth, 'base64').toString().split(':')

  if(ethAddress && password) {
    try {
      // logger(`Web3: Unlocking wallet ${ethAddress}...`);
      await web3.eth.personal.unlockAccount(ethAddress, password);
      logger(`Web3: Wallet ${ethAddress} is unlocked`);
    } catch(err) {
      loggerErr(err)
    }
  }


  req.web3 = {
    engine: web3,
    defaultAddress: ethAddress
  };

  next();
};

module.exports.web3PostHandler = (web3) => async (req, res, next) => {
  const ethAddress = get(req, 'web3.defaultAddress');

  if(ethAddress) {
    try {
      // logger(`Web3: Locking wallet ${ethAddress}...`);
      await web3.eth.personal.lockAccount(ethAddress);
      logger(`Web3: Wallet ${ethAddress} is locked`);
    } catch(err) {
      loggerErr(err)
    }
  }
  next();
};
