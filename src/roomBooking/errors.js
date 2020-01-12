/**
 * User: ggarrido
 * Date: 12/01/20 3:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

/**
 * InvalidRequestErrorCode
 */
const NotAvailableRoomErrorCode = module.exports.NotAvailableRoomErrorCode = 'ROOM_NOT_AVAILABLE';
module.exports.NotAvailableRoomError = (companyId, roomId) => {
  const err = new Error(`Room not available: { companyId:"${companyId}", roomId:${roomId} }`);
  err.code = NotAvailableRoomErrorCode;
  return err;
}

