/**
 * User: ggarrido
 * Date: 9/01/20 16:53
 * Copyright 2019 (c) Lightstreams, Granada
 */


const express = require('express');

const {
  postReservationHandler,
  isRoomAvailableHandler,
  getReservationHandler,
  deleteReservationHandler
} = require('../handler/roomBooking');

const {
  web3AuthLock,
  web3AuthUnlock,
} = require('../middleware/web3');

let router = express.Router();

router.get('/isRoomAvailable', isRoomAvailableHandler);
router.get('/reservation/:reservationId', getReservationHandler);
router.post('/reservation', web3AuthUnlock, postReservationHandler, web3AuthLock);
router.delete('/reservation/:reservationId', web3AuthUnlock, deleteReservationHandler, web3AuthLock);

module.exports = router;
