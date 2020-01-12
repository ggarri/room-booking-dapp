/**
 * User: ggarrido
 * Date: 12/01/20 10:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const {
  createReservation
} = require('../../roomBooking/application');

const {
  validateRequestAttrs,
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

  } catch ( err ) {
    next(err)
  }
}
