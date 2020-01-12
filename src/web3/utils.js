/**
 * User: ggarrido
 * Date: 11/01/20 16:48
 * Copyright 2019 (c) Lightstreams, Granada
 */

const get = require('lodash.get');

module.exports.strToBytes = (web3, value) => {
  return web3.utils.hexToBytes(web3.utils.toHex(value));
}

module.exports.hexToStr = (web3, value) => {
  return web3.utils.hexToUtf8(value);
}

module.exports.eventArgs = (tx, eventId) => {
  const logs = get(tx, 'logs', []);
  const logItem = logs.filter(log => log.event === eventId);
  return get(logItem, '0.args', {})
}

module.exports.bnToInt = (web3, value) => {
  if(!web3.utils.isBN(value)) return null;
  return parseInt(value.toString());
}


module.exports.calculateEstimatedGas = (method, params) => {
  return new Promise((resolve, reject) => {
    method.estimateGas(params, (err, estimatedGas) => {
      if (err) {
        reject(err);
      } else {
        const gasOverflow = parseInt(estimatedGas * 1.2); // 20% Increment
        const gasMin = 100000;
        const gas = gasMin > gasOverflow ? gasMin : gasOverflow;
        resolve(gas);
      }
    });
  })
};

module.exports.isEmptyAddress = (value) => {
  return value === "0x0000000000000000000000000000000000000000";
}
