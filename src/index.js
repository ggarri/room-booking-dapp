/**
 * User: ggarrido
 * Date: 8/01/20 19:48
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Wrapper = require('./web3/wrapper');
const express = require('./http')

module.exports.newHttpServer = ({ httpCfg, web3Cfg }) => {
  const web3 = web3Wrapper.newEngine(web3Cfg.provider, web3Cfg.options);
  return express.newServer(web3, {
    port: httpCfg.port,
    host: httpCfg.host
  })
};
