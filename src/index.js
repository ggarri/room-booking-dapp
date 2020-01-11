/**
 * User: ggarrido
 * Date: 8/01/20 19:48
 * Copyright 2019 (c) Lightstreams, Granada
 */

const server = require('./express');

module.exports = (() => {
  let server, web3;
  return {
    init: (httpCfg, web3Cfg) => {

    },
    start: () => {
      const { port } = httpCfg;
      server.start(port || 8080)
    }
  }
})();
