/**
 * User: ggarrido
 * Date: 9/01/20 16:53
 * Copyright 2019 (c) Lightstreams, Granada
 */


const express = require('express');

const {
  newReservationHandler,
  isRoomAvailableHandler
} = require('../handler/roomBooking');

let router = express.Router();

router.get('/isRoomAvailable', isRoomAvailableHandler);
router.post('/new', newReservationHandler);


module.exports = router;
