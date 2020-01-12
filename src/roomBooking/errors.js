/**
 * User: ggarrido
 * Date: 12/01/20 3:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

/**
 * InvalidCompanyIdError
 */
const InvalidCompanyIdErrorCode = module.exports.InvalidCompanyIdErrorCode = 'INVALID_COMPANY_ID';
module.exports.InvalidCompanyIdError = (companyId) => {
  const err = new Error(`Company value "${companyId}" is not valid`);
  err.code = InvalidCompanyIdErrorCode;
  return err;
}

/**
 * InvalidCompanyRoomIdError
 */
const InvalidCompanyRoomIdErrorCode = module.exports.InvalidCompanyRoomIdErrorCode = 'INVALID_COMPANY_ID';
module.exports.InvalidCompanyRoomIdError = (companyId, roomId) => {
  const err = new Error(`CompanyRoomId value "${companyId}.${roomId}" is not valid`);
  err.code = InvalidCompanyRoomIdErrorCode;
  return err;
}

/**
 * InvalidEmployeeAddr
 */
const InvalidEmployeeAddrErrorCode = module.exports.InvalidEmployeeAddrErrorCode = 'INVALID_EMPLOYEE_ADDR';
module.exports.InvalidEmployeeAddrError = (address) => {
  const err = new Error(`Employee address "${address}" is not authorized`);
  err.code = InvalidEmployeeAddrErrorCode;
  return err;
}

/**
 * NotAvailableRoomError
 */
const NotAvailableRoomErrorCode = module.exports.NotAvailableRoomErrorCode = 'ROOM_NOT_AVAILABLE';
module.exports.NotAvailableRoomError = (companyId, roomId) => {
  const err = new Error(`Room is not available(companyId:${companyId}, roomId:${roomId})`);
  err.code = NotAvailableRoomErrorCode;
  return err;
}

/**
 * ReservationDoesNotExistsError
 */
const ReservationDoesNotExistsErrorCode = module.exports.ReservationDoesNotExistsErrorCode = 'RESERVATION_DOES_NOT_EXISTS';
module.exports.ReservationDoesNotExistsError = (reservationId) => {
  const err = new Error(`Cannot find reservation ${reservationId}`);
  err.code = ReservationDoesNotExistsErrorCode;
  return err;
}

/**
 * ReservationNotOwnerError
 */
const ReservationNotOwnerErrorCode = module.exports.ReservationNotOwnerErrorCode = 'RESERVATION_NOT_OWNER';
module.exports.ReservationNotOwnerError = (reservationId, employeeAddress) => {
  const err = new Error(`Account ${employeeAddress} is not owner of reservation ${reservationId}`);
  err.code = ReservationNotOwnerErrorCode;
  return err;
}
