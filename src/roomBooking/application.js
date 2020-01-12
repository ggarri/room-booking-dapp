/**
 * User: ggarrido
 * Date: 12/01/20 2:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const {
  roomBookingAddr
} = require('../config');

const {
  createReservation
} = require('./contract');

module.exports.createReservation = async (web3, { from, roomId, companyId, bookingDateHour }) => {
  try {
    //@TODO validate availability
    const rId = await createReservation(web3, {
      from,
      contractAt: roomBookingAddr
    }, {
      roomId,
      companyId,
      bookingDateHour
    })

    return rId;
  } catch ( err ) {
    next(err)
  }
}

