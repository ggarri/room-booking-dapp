/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const {
  createReservation,
  isRoomAvailable
} = require('../../roomBooking/application');

const {
  validateRequestAttrs,
  extractRequestAttrs,
  extractWeb3FromAddr,
  extractWeb3Engine
} = require('../request')

module.exports.newReservationHandler = async (req, res, next) => {
  try {
    const queryAttrs = ['roomId', 'companyId', 'bookingDateHour'];
    validateRequestAttrs(req, queryAttrs);

    const attr = extractRequestAttrs(queryAttrs);
    const web3 = extractWeb3Engine(req);
    const fromAddress = extractWeb3FromAddr(req);

    const rId = await createReservation(web3, {
      from: fromAddress,
      ...attr
    })

    res.send(successJsonResponse({
      reservationId: rId
    }));

    next();
  } catch ( err ) {
    next(err)
  }
}

module.exports.isRoomAvailableHandler = async (req, res, next) => {
  try {
    const queryAttrs = ['roomId', 'companyId', 'bookingDateHour'];
    validateRequestAttrs(req, queryAttrs);

    const attr = extractRequestAttrs(req, queryAttrs);
    const web3 = extractWeb3Engine(req);

    console.log('attr: ', attr)
    const isAvailable = await isRoomAvailable(web3, {
      ...attr,
      bookingDateHour: new Date(attr['bookingDateHour'])
    })

    res.send(successJsonResponse({
      isAvailable
    }));

    next();
  } catch ( err ) {
    next(err)
  }
}

