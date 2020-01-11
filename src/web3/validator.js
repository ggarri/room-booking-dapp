/**
 * User: ggarrido
 * Date: 11/01/20 19:41
 * Copyright 2019 (c) Lightstreams, Granada
 */


function assert(errMsg, argName) {
  if(argName) {
    throw new Error(`Argument "${argName}": ${errMsg}`);
  }
  throw new Error(errMsg);
}

module.exports.validateAddress = (value, argName = null) => {
  if (!isAddress(value)) {
    assert(`Invalid eth address "${value}"`, argName);
  }
};

module.exports.validateUInt = (value, argName = null) => {
  if(!Number.isInteger(value) || parseInt(value) < 0) {
    assert(`Invalid uint "${value}"`, argName);
  }
}

module.exports.validateNotEmptyStr = (value, argName = null) => {
  if(typeof value !== 'string') {
    assert(`Invalid string "${value}"`, argName);
  }

  if(value === "") {
    assert(`Invalid not empty string "${value}"`, argName);
  }
}

module.exports.validateDate = (value, argName = null) => {
  if (!value instanceof Date) {
    assert(`Invalid date object "${value}"`, argName);
  }
}
