/**
 * User: ggarrido
 * Date: 11/01/20 19:36
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Wrapper = require('../web3/wrapper');
const web3Utils = require('../web3/utils');
const validators = require('../web3/validator');

const roomBookingContract = require('../../build/contracts/RoomBooking.json');

module.exports.deploy = (web3, { from }, { companyAddr }) => {
  validators.validateAddress(companyAddr, 'companyAddr');

  return web3Wrapper.deployContract(web3, {
    abi: roomBookingContract.abi,
    bytecode: roomBookingContract.bytecode,
    from,
    params: [
      companyAddr
    ]
  });
}

module.exports.appendCompany = (web3, { from, contractAt }, { companyAddr }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');
  validators.validateAddress(companyAddr, 'companyAddr');

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'appendCompany',
    abi: roomBookingContract.abi,
    params: [
      companyAddr
    ]
  })
}

module.exports.createReservation = (web3, { from, contractAt }, { companyId, roomId, bookDate }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');

  validators.validateNotEmptyStr(companyId, 'companyId');
  validators.validateNotEmptyStr(roomId, 'roomId');
  validators.validateDate(bookDate, 'date');

  const year = bookDate.getFullYear();
  const month = bookDate.getMonth() + 1;
  const day = bookDate.getDay();
  const hour = bookDate.getHours();

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'createReservation',
    abi: roomBookingContract.abi,
    params: [
      web3Utils.strToBytes(companyId),
      web3Utils.strToBytes(roomId),
      year,
      month,
      day,
      hour,
    ]
  })
}

module.exports.removeReservation = (web3, { from, contractAt }, { reservationId }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'removeReservation',
    abi: roomBookingContract.abi,
    params: [
      reservationId
    ]
  })
}

module.exports.reservationInfo = (web3, { contractAt }, { reservationId }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');

  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'removeReservation',
    abi: roomBookingContract.abi,
    params: [
      reservationId
    ]
  }).then(res => {
    const { companyId: companyIdHex, roomId: roomIdHex, year, day, month, hour } = res;
    const bookDate = new Date(`${year}/${month}/${day} ${hour}:00`);
    return {
      companyId: web3Utils.hexToStr(companyIdHex),
      roomId: web3Utils.hexToStr(roomIdHex),
      bookDate
    }
  })
}

module.exports.isRoomAvailable = (web3, { contractAt }, { companyId, roomId, bookDate }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');

  validators.validateNotEmptyStr(companyId, 'companyId');
  validators.validateNotEmptyStr(roomId, 'roomId');
  validators.validateDate(bookDate, 'date');

  const year = bookDate.getFullYear();
  const month = bookDate.getMonth() + 1;
  const day = bookDate.getDay();
  const hour = bookDate.getHours();

  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'isRoomAvailable',
    abi: roomBookingContract.abi,
    params: [
      web3Utils.strToBytes(companyId),
      web3Utils.strToBytes(roomId),
      year,
      month,
      day,
      hour,
    ]
  })
}
