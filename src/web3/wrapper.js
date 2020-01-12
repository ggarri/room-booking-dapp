/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Debug = require('debug');
const Web3 = require('web3');
const net = require('net');

const { calculateEstimatedGas, newFailedTxError } = require('./utils');
const { web3cfg } = require('../config')
const logger = Debug('app:web3');

module.exports.newEngine = (provider, options = {}) => {
  // return new Web3(provider || web3cfg.provider);
  return new Web3(provider || web3cfg.provider, net, {
    defaultGasPrice: options.gasPrice || web3cfg.gasPrice,
  });
};


module.exports.contractCall = (web3, { to: contractAddr, abi, from, method, params }) => {
  return new Promise(async (resolve, reject) => {

    try {
      const contract = new web3.eth.Contract(abi, contractAddr);
      if (typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }

      const result = await contract.methods[method](...(params || [])).call({ from });
      resolve(result);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.contractSendTx = (web3, { to: contractAddr, abi, from, method, params, value, gas}) => {
  return new Promise(async (resolve, reject) => {

    try {
      const contract = new web3.eth.Contract(abi, contractAddr);
      if (typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }

      const sendTx = contract.methods[method](...(params || []));
      const estimatedGas = gas || await calculateEstimatedGas(sendTx, { from, value });

      sendTx.send({
        from,
        value,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        logger(`Tx executed: ${txHash}`)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) reject(txReceipt);
        else resolve(txReceipt);
      }).on('error', reject);

    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.deployContract = (web3, { from, abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {

    try {
      const contract = new web3.eth.Contract(abi);
      const contractDeploy = contract.deploy({ data: bytecode, arguments: params || [] });
      const estimatedGas = await calculateEstimatedGas(contractDeploy, { from });

      contractDeploy.send({
        from,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        logger(`Tx executed: ${txHash}`)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) reject(newFailedTxError(txReceipt));
        else resolve(txReceipt);
      }).on('error', reject);

    } catch ( err ) {
      reject(err);
    }
  });
};

