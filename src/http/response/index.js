/**
 * User: ggarrido
 * Date: 9/01/20 16:53
 * Copyright 2019 (c) Lightstreams, Granada
 */


module.exports.successJsonResponse = (data) => {
  return {
    success: true,
    data
  };
}

module.exports.failedJsonResponse = (errMsg, errCode) => {
  return {
    success: false,
    err: {
      message: errMsg,
      code: errCode || 500
    }
  };
}
