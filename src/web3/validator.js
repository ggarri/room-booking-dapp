/**
 * User: ggarrido
 * Date: 11/01/20 19:41
 * Copyright 2019 (c) Lightstreams, Granada
 */


const { AssertArgError } = require('./errors');
const { isEmptyAddress } = require('./utils');

//@TODO Include ETH checksum and sha3 verification
function isAddress(address) {
  return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}

module.exports.validateAddress = (value, argName = null) => {
  if (!isAddress(value)) {
    throw AssertArgError(`Invalid eth address "${value}"`, argName);
  }
};

module.exports.validateUInt = (value, argName = null) => {
  if(!Number.isInteger(value) || parseInt(value) < 0) {
    throw AssertArgError(`Invalid uint "${value}"`, argName);
  }
}

module.exports.validateNotEmptyStr = (value, argName = null) => {
  if(typeof value !== 'string') {
    throw AssertArgError(`Invalid string "${value}"`, argName);
  }

  if(value === "") {
    throw AssertArgError(`Invalid not empty string "${value}"`, argName);
  }
}

module.exports.validateBookingDate = (value, argName = null) => {
  if (!value instanceof Date) {
    throw AssertArgError(`Invalid date object "${value}"`, argName);
  }
  if(isNaN(value.getTime())) {
    throw AssertArgError(`Invalid date object "${value}"`, argName);
  }
}

module.exports.isNotEmptyAddress = (value, argName) => {
  if(isEmptyAddress(value)) {
    throw AssertArgError(`Invalid empty address`, argName);
  }
}
