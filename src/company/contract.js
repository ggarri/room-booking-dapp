/**
 * User: ggarrido
 * Date: 11/01/20 19:36
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Wrapper = require('../web3/wrapper');
const web3Utils = require('../web3/utils');
const validators = require('../web3/validator');

const companyContract = require('../../build/contracts/Company.json');

module.exports.deploy = (web3, { from }, { companyId, companyName, openAt, closeAt}) => {
  validators.validateNotEmptyStr(companyId, 'companyId');
  validators.validateNotEmptyStr(companyName, 'companyName');
  validators.validateUInt(openAt, 'openAt');
  validators.validateUInt(closeAt, 'closeAt');
  validators.validateAddress(from, 'from');

  return web3Wrapper.deployContract(web3, {
    abi: companyContract.abi,
    bytecode: companyContract.bytecode,
    from,
    params: [
      web3Utils.strToBytes(web3, companyId),
      companyName,
      openAt,
      closeAt
    ]
  });
}

module.exports.addEmployee = (web3, { from, contractAt }, { employeeUsername, employeeAddr }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');
  validators.validateAddress(employeeAddr, 'employeeAddr');
  validators.validateNotEmptyStr(employeeUsername, 'employeeUsername');

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'addEmployee',
    abi: companyContract.abi,
    params: [
      web3Utils.strToBytes(employeeUsername),
      employeeAddr
    ]
  })
}

module.exports.addRoom = (web3, { from, contractAt }, { roomId, roomName }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');
  validators.validateNotEmptyStr(roomId, 'roomId');
  validators.validateNotEmptyStr(roomName, 'roomName');

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'addRoom',
    abi: companyContract.abi,
    params: [
      web3Utils.strToBytes(roomId),
      roomName
    ]
  })
}
