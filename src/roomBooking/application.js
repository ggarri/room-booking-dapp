/**
 * User: ggarrido
 * Date: 12/01/20 2:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const {
  roomBookingAddr
} = require('../config');

const {
  createReservation: txCreateReservation,
  isRoomAvailable: callIsRoomAvailable,
  reservationInfo: callReservationInfo,
  removeReservation: txRemoveReservation
} = require('./contract');

const {
  validateCompanyId,
  validateCompanyRoomId,
  validateEmployeeAddress
} = require('./validator');

const{
  NotAvailableRoomError,
  ReservationDoesNotExistsError,
  ReservationNotOwnerError
} = require('./errors')

const web3Utils = require('../web3/utils')

const isRoomAvailable = module.exports.isRoomAvailable = async (web3, { roomId, companyId, bookingDateHour }) => {
  await validateCompanyId(web3, { companyId });
  await validateCompanyRoomId(web3, { companyId, roomId });

  console.log(bookingDateHour);
  const isAvailable = await callIsRoomAvailable(web3, {
    contractAt: roomBookingAddr
  }, {
    roomId,
    companyId,
    bookingDateHour
  });

  return isAvailable
}

module.exports.createReservation = async (web3, { employeeAddress, roomId, companyId, bookingDateHour }) => {
  const isAvailable = await isRoomAvailable(web3, {
    roomId,
    companyId,
    bookingDateHour
  });

  if (!isAvailable) {
    throw NotAvailableRoomError(companyId, roomId)
  }

  await validateEmployeeAddress(web3, { employeeAddress })

  const rId = await txCreateReservation(web3, {
    from: employeeAddress,
    contractAt: roomBookingAddr
  }, {
    roomId,
    companyId,
    bookingDateHour
  })

  return rId;
}

module.exports.removeReservation = async (web3, { employeeAddress, reservationId }) => {

  const resInfo = await reservationInfo(web3, {
    reservationId
  });

  if (resInfo.employeeAddr.toLowerCase() !== employeeAddress.toLowerCase()) {
    throw ReservationNotOwnerError(reservationId, employeeAddress);
  }

  await txRemoveReservation(web3, {
    contractAt: roomBookingAddr,
    from: employeeAddress
  }, {
    reservationId
  })

  return {
    delete: true
  };
}


const reservationInfo = module.exports.reservationInfo = async (web3, { reservationId }) => {

  const resInfo = await callReservationInfo(web3, {
    contractAt: roomBookingAddr
  }, {
    reservationId
  });

  if(web3Utils.isEmptyAddress(resInfo.employeeAddr)) {
    throw ReservationDoesNotExistsError(reservationId);
  }

  return resInfo;
}

