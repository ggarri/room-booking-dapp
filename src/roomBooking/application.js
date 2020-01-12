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
  isRoomAvailable: callIsRoomAvailable
} = require('./contract');

const{
  NotAvailableRoomError
} = require('./errors')

const isRoomAvailable = module.exports.isRoomAvailable =  async (web3, { roomId, companyId, bookingDateHour }) => {
    const isAvailable = await callIsRoomAvailable(web3, {
      contractAt: roomBookingAddr
    }, {
      roomId,
      companyId,
      bookingDateHour
    });

    return isAvailable
}

module.exports.createReservation = async (web3, { from, roomId, companyId, bookingDateHour }) => {
  const isAvailable = isRoomAvailable(web3, {
    roomId,
    companyId,
    bookingDateHour
  });

  if(!isAvailable) {
    throw NotAvailableRoomError(companyId, roomId)
  }

  const rId = await txCreateReservation(web3, {
    from,
    contractAt: roomBookingAddr
  }, {
    roomId,
    companyId,
    bookingDateHour
  })

  return rId;
}

