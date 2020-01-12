/**
 * User: ggarrido
 * Date: 11/01/20 19:28
 * Copyright 2019 (c) Lightstreams, Granada
 */

module.exports.web3Cfg = {
  provider: `${process.env.RPC_HOST || 'http://localhost'}` + ':' + `${process.env.RPC_PORT || '8545'}`,
  options: {
    gasPrice: process.env.GAS_PRICE || 500000000000
  }
};

module.exports.httpCfg = {
  port: process.env.HTTP_PORT || '3000',
  host: process.env.HTTP_HOST || '127.0.0.1',
  env: process.env.NODE_ENV || 'development'
}

module.exports.roomBookingAddr = process.env.ROOM_BOOKING_CONTRACT_ADDR;
