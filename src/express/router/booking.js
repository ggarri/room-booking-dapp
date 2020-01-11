/**
 * User: ggarrido
 * Date: 9/01/20 16:53
 * Copyright 2019 (c) Lightstreams, Granada
 */


const express = require('express');
const {
  newBookHandler
} = require('../handler/booking');

let router = express.Router();

router.post('/', newBookHandler);


module.exports = router;
