/**
 * User: ggarrido
 * Date: 12/01/20 15:54
 * Copyright 2019 (c) Lightstreams, Granada
 */


const {
  roomBookingAddr
} = require('../config');

const {
  companyAddress: callCompanyAddress,
  isAddressEmployee: callIsAddressEmployee,
} = require('./contract');

const {
  roomExists: callRoomExists,
  isBuildingOpen: callIsBuildingOpen
} = require('../company/contract')

const {
  InvalidCompanyIdError,
  InvalidCompanyRoomIdError,
  InvalidEmployeeAddrError,
  CompanyIsNotOpenError
} = require('./errors')

const web3Utils = require('../web3/utils');

module.exports.validateCompanyId = async (web3, { companyId }) => {
  const companyAddr = await callCompanyAddress(web3, {
    contractAt: roomBookingAddr
  }, {
    companyId
  });

  if (web3Utils.isEmptyAddress(companyAddr)) {
    throw InvalidCompanyIdError(companyId);
  }
}

module.exports.validateEmployeeAddress = async (web3, { employeeAddress }) => {
  const isEmployee = await callIsAddressEmployee(web3, {
    contractAt: roomBookingAddr
  }, {
    address: employeeAddress
  });

  if (!isEmployee) {
    throw InvalidEmployeeAddrError(employeeAddress);
  }
}

module.exports.validateCompanyRoomId = async (web3, { companyId, roomId }) => {
  const companyAddr = await callCompanyAddress(web3, {
    contractAt: roomBookingAddr
  }, {
    companyId
  });

  if (web3Utils.isEmptyAddress(companyAddr)) {
    throw InvalidCompanyIdError(companyId);
  }

  const roomExists = await callRoomExists(web3, {
    contractAt: companyAddr,
  }, {
    roomId
  });

  if (!roomExists) {
    throw InvalidCompanyRoomIdError(companyId, roomId)
  }
}

module.exports.validateCompanyOpenAt = async (web3, { companyId, hourAt }) => {
  const companyAddr = await callCompanyAddress(web3, {
    contractAt: roomBookingAddr
  }, {
    companyId
  });

  if (web3Utils.isEmptyAddress(companyAddr)) {
    throw InvalidCompanyIdError(companyId);
  }

  const isOpen = await callIsBuildingOpen(web3, {
    contractAt: companyAddr,
  }, {
    hourAt
  });

  if (!isOpen) {
    throw CompanyIsNotOpenError(companyId, hourAt)
  }
}
