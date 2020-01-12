/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const {
  createReservation,
  isRoomAvailable,
  removeReservation,
  reservationInfo
} = require('../../roomBooking/application');

const {
  validateRequestAttrs,
  extractRequestAttrs,
  extractWeb3FromAddr,
  extractWeb3Engine
} = require('../request')

const {
  successJsonResponse
} = require('../response')

module.exports.postReservationHandler = async (req, res, next) => {
  try {
    const queryAttrs = ['roomId', 'companyId', 'bookingDateHour'];
    validateRequestAttrs(req, queryAttrs);

    const attr = extractRequestAttrs(req, queryAttrs);
    const web3 = extractWeb3Engine(req);
    const fromAddress = extractWeb3FromAddr(req);

    const rId = await createReservation(web3, {
      employeeAddress: fromAddress,
      ...attr,
      bookingDateHour: new Date(attr['bookingDateHour'])
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

module.exports.getReservationHandler = async (req, res, next) => {
  try {
    const queryAttrs = ['reservationId'];
    validateRequestAttrs(req, queryAttrs);

    const attr = extractRequestAttrs(req, queryAttrs);
    const web3 = extractWeb3Engine(req);

    const rInfo = await reservationInfo(web3, {
      ...attr,
    })

    res.send(successJsonResponse(rInfo));
  } catch ( err ) {
    next(err)
  }
}

module.exports.deleteReservationHandler = async(req, res, next) => {
  try {
    const queryAttrs = ['reservationId'];
    validateRequestAttrs(req, queryAttrs);

    const attr = extractRequestAttrs(req, queryAttrs);
    const web3 = extractWeb3Engine(req);
    const fromAddress = extractWeb3FromAddr(req);

    const rInfo = await removeReservation(web3, {
      employeeAddress: fromAddress,
      ...attr,
    })

    res.send(successJsonResponse(rInfo));

    next();
  } catch ( err ) {
    next(err)
  }
}

