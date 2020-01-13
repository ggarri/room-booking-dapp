/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Debug = require('debug');
const logger = Debug('app:http:web3');
const loggerErr = Debug('app:http:err');

const {
  extractWeb3Engine,
  extractWeb3FromAddr
} = require('../request')

const {
  Web3AuthError
} = require('../errors')

module.exports.web3Injector = (web3) => async (req, res, next) => {
  req.web3Engine = web3;
  next();
};

module.exports.web3AuthUnlock = async (req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [ethAddress, password] = new Buffer.from(b64auth, 'base64').toString().split(':')

  if(!ethAddress || !password) {
    next(Web3AuthError())
    return;
  }

  try {
    const web3 = extractWeb3Engine(req);
    // logger(`Web3: Unlocking wallet ${ethAddress}...`);
    await web3.eth.personal.unlockAccount(ethAddress, password);
    logger(`Wallet ${ethAddress} is unlocked`);
    req.web3FromAddress = ethAddress;
    next();
  } catch(err) {
    next(err)
  }
};

module.exports.web3AuthLock = async (req, res, next) => {
  const ethAddress = extractWeb3FromAddr(req);
  if(ethAddress) {
    try {
      const web3 = extractWeb3Engine(req);
      // logger(`Web3: Locking wallet ${ethAddress}...`);
      await web3.eth.personal.lockAccount(ethAddress);
      logger(`Wallet ${ethAddress} is locked`);
    } catch(err) {
      loggerErr(err)
    }
  }
};
