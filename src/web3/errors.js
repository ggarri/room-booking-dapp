/**
 * User: ggarrido
 * Date: 12/01/20 3:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const FailedTxErrorCode = module.exports.FailedTxErrorCode = 'WEB3_TX_FAILED';
module.exports.FailedTxError = (txReceipt) => {
  const err = new Error(`Tx ${txReceipt.hash} has been reverted`);
  err.receipt = txReceipt;
  err.code = FailedTxErrorCode;
  return err;
};

const AssertArgErrorCode = module.exports.AssertArgErrorCode = 'WEB3_ASSERT_ARG';
module.exports.AssertArgError = (errMsg, argName) => {
  const err = argName
  ? new Error(`Argument "${argName}": ${errMsg}`)
  : new Error(errMsg);

  err.code = AssertArgErrorCode;

  return err;
};

