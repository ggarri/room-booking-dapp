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
  const err = new Error(`Company "${companyId}" does not exists`);
  err.code = InvalidCompanyIdErrorCode;
  return err;
}

/**
 * InvalidCompanyRoomIdError
 */
const InvalidCompanyRoomIdErrorCode = module.exports.InvalidCompanyRoomIdErrorCode = 'INVALID_COMPANY_ID';
module.exports.InvalidCompanyRoomIdError = (companyId, roomId) => {
  const err = new Error(`Company "${companyId}", room "${roomId}" does not exists`);
  err.code = InvalidCompanyRoomIdErrorCode;
  return err;
}

/**
 * CompanyIsNotOpenError
 */
const CompanyIsNotOpenErrorCode = module.exports.CompanyIsNotOpenErrorCode = 'COMPANY_BUILDING_NOT_OPEN';
module.exports.CompanyIsNotOpenError = (companyId, hourAt) => {
  const err = new Error(`Company "${companyId}", building not open at ${hourAt}.00H`);
  err.code = CompanyIsNotOpenErrorCode;
  return err;
}

/**
 * InvalidEmployeeAddr
 */
const InvalidEmployeeAddrErrorCode = module.exports.InvalidEmployeeAddrErrorCode = 'EMPLOYEE_NOT_AUTH';
module.exports.InvalidEmployeeAddrError = (address) => {
  const err = new Error(`Employee address "${address}" is not authorized`);
  err.code = InvalidEmployeeAddrErrorCode;
  return err;
}

/**
 * NotAvailableRoomError
 */
const NotAvailableRoomErrorCode = module.exports.NotAvailableRoomErrorCode = 'ROOM_NOT_AVAILABLE';
module.exports.NotAvailableRoomError = (companyId, roomId, hourAt) => {
  const err = new Error(`Company "${companyId}", Room "${roomId}", is not available at ${hourAt}`);
  err.code = NotAvailableRoomErrorCode;
  return err;
}

/**
 * ReservationDoesNotExistsError
 */
const ReservationDoesNotExistsErrorCode = module.exports.ReservationDoesNotExistsErrorCode = 'RESERVATION_DOES_NOT_EXISTS';
module.exports.ReservationDoesNotExistsError = (reservationId) => {
  const err = new Error(`Cannot find reservation "${reservationId}"`);
  err.code = ReservationDoesNotExistsErrorCode;
  return err;
}

/**
 * ReservationNotOwnerError
 */
const ReservationNotOwnerErrorCode = module.exports.ReservationNotOwnerErrorCode = 'RESERVATION_NOT_OWNER';
module.exports.ReservationNotOwnerError = (reservationId, employeeAddress) => {
  const err = new Error(`Account "${employeeAddress}" is not owner of reservation "${reservationId}"`);
  err.code = ReservationNotOwnerErrorCode;
  return err;
}
