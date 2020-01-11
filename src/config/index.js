/**
 * User: ggarrido
 * Date: 11/01/20 19:28
 * Copyright 2019 (c) Lightstreams, Granada
 */

module.exports.web3cfg = {
  provider: `${process.env.RPC_HOST || 'http://localhost'}` + `${process.env.RPC_PORT || '8545'}`,
  gasPrice: process.env.GAS_PRICE || 500000000000
};
