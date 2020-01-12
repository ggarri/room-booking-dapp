/**
 * User: ggarrido
 * Date: 11/01/20 19:36
 * Copyright 2019 (c) Lightstreams, Granada
 */

const get = require('lodash.get');
const web3Wrapper = require('../web3/wrapper');
const web3Utils = require('../web3/utils');
const validators = require('../web3/validator');

const roomBookingContract = require('../../build/contracts/RoomBooking.json');

function decomposeDate(bookingDateHour) {
  return {
    year: bookingDateHour.getFullYear(),
    month: bookingDateHour.getMonth() + 1,
    day: bookingDateHour.getDate(),
    hour: bookingDateHour.getHours()
  }
}

function composeDate({ year, month, day, hour }) {
  const d = new Date();
  d.setUTCFullYear(year);
  d.setUTCMonth(month - 1);
  d.setUTCDate(day);
  d.setUTCHours(hour);
  d.setUTCMinutes(0);
  return d;
}

module.exports.deploy = (web3, { from }, { companyAddr }) => {
  validators.validateAddress(companyAddr, 'companyAddr');

  return web3Wrapper.deployContract(web3, {
    abi: roomBookingContract.abi,
    bytecode: roomBookingContract.bytecode,
    from,
    params: [
      companyAddr
    ]
  }).then(tx => {
    return tx.contractAddress;
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

module.exports.createReservation = (web3, { from, contractAt }, { companyId, roomId, bookingDateHour }) => {
  validators.validateAddress(from, 'from');
  validators.validateAddress(contractAt, 'contractAt');

  validators.validateNotEmptyStr(companyId, 'companyId');
  validators.validateNotEmptyStr(roomId, 'roomId');
  validators.validateBookingDate(bookingDateHour, 'bookingDateHour');

  const { year, month, day, hour } = decomposeDate(bookingDateHour);

  return web3Wrapper.contractSendTx(web3, {
    to: contractAt,
    from,
    method: 'createReservation',
    abi: roomBookingContract.abi,
    params: [
      web3Utils.strToBytes(web3, companyId),
      web3Utils.strToBytes(web3, roomId),
      year,
      month,
      day,
      hour
    ]
  }).then(tx => {
    const rId = get(tx, 'events.ReservationAdded.returnValues.reservationId');
    return rId;
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
  validators.validateAddress(contractAt, 'contractAt');

  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'reservationInfo',
    abi: roomBookingContract.abi,
    params: [
      reservationId
    ]
  }).then(res => {
    return {
      companyId: web3Utils.hexToStr(web3, res.companyId),
      roomId: web3Utils.hexToStr(web3, res.roomId),
      employeeAddr: res.employeeAddr,
      bookingDateHour: composeDate(res)
    }
  })
}

module.exports.companyAddress = (web3, { contractAt }, { companyId }) => {
  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'companyAddress',
    abi: roomBookingContract.abi,
    params: [
      web3Utils.strToBytes(web3, companyId)
    ]
  })
}

module.exports.isAddressEmployee = (web3, { contractAt }, { address }) => {
  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'isAddressEmployee',
    abi: roomBookingContract.abi,
    params: [
      address
    ]
  })
}

module.exports.isRoomAvailable = (web3, { contractAt }, { companyId, roomId, bookingDateHour }) => {
  validators.validateAddress(contractAt, 'contractAt');

  validators.validateNotEmptyStr(companyId, 'companyId');
  validators.validateNotEmptyStr(roomId, 'roomId');
  validators.validateBookingDate(bookingDateHour, 'bookingDateHour');

  const { year, month, day, hour } = decomposeDate(bookingDateHour);

  return web3Wrapper.contractCall(web3, {
    to: contractAt,
    method: 'isRoomAvailable',
    abi: roomBookingContract.abi,
    params: [
      web3Utils.strToBytes(web3, companyId),
      web3Utils.strToBytes(web3, roomId),
      year,
      month,
      day,
      hour
    ]
  })
}
