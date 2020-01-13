/**
 * User: ggarrido
 * Date: 8/01/20 19:49
 * Copyright 2019 (c) Lightstreams, Granada
 */
require('dotenv').config()

const Debug = require('debug');
const web3Wrapper = require('../src/web3/wrapper');
const { web3Cfg } = require('../src/config');

const logger = Debug('app:setup');
const companyContractWrapper = require('../src/company/contract');
const roomBookingContractWrapper = require('../src/roomBooking/contract');

const companyOneData = require('../setup/companyOne.json');
const companyTwoData = require('../setup/companyTwo.json');

async function initCompany(web3, companyInfo) {
  const companyAddr = await companyContractWrapper.deploy(web3, {
    from: companyInfo.companyOwner
  }, {
    companyName: companyInfo.companyName,
    companyId: companyInfo.companyId,
    openAt: companyInfo.openAt,
    closeAt: companyInfo.closeAt
  });
  logger(`Company "${companyInfo.companyName}" was deployed at ${companyAddr}`);

  for ( let idx = 0; idx < companyInfo.employees.length; idx++ ) {
    const employee = companyInfo.employees[idx];
    await companyContractWrapper.addEmployee(web3, {
      contractAt: companyAddr,
      from: companyInfo.companyOwner
    }, {
      employeeAddr: employee.address,
      employeeUsername: employee.username
    })
    logger(`Employee ${employee.username} was added`)
  }

  for ( let idx = 0; idx < companyInfo.rooms.length; idx++ ) {
    const room = companyInfo.rooms[idx];
    await companyContractWrapper.addRoom(web3, {
      contractAt: companyAddr,
      from: companyInfo.companyOwner
    }, {
      roomId: room.id,
      roomName: room.name
    });
    logger(`Room ${room.name} was added`)
  }

  return companyAddr;
}

async function initRoomBooking(web3, companyOneOwnerAddr, companyOneAddr, companyTwoAddr = null) {
  const roomBookingAddr = await roomBookingContractWrapper.deploy(web3, {
    from: companyOneOwnerAddr
  }, {
    companyAddr: companyOneAddr
  });

  logger(`RoomBooking deployed at ${roomBookingAddr}`)
  logger(`Added companyOne ${companyOneAddr}`);

  if (companyTwoAddr) {
    roomBookingContractWrapper.appendCompany(web3, {
      contractAt: roomBookingAddr,
      from: companyOneOwnerAddr
    }, {
      companyAddr: companyTwoAddr
    });
    logger(`Added companyTwo ${companyTwoAddr}`);
  }

  return roomBookingAddr;
}

async function initializeApp() {
  logger(`Using web3 provider: ${web3Cfg.provider}`);

  const web3 = web3Wrapper.newEngine(web3Cfg.provider);

  const companyOneAddr = await initCompany(web3, companyOneData);
  logger(`CompanyOne "${companyOneData.companyName}" was initialized successfully`);

  const companyTwoAddr = await initCompany(web3, companyTwoData);
  logger(`CompanyOne "${companyTwoData.companyName}" was initialized successfully`);

  const roomBookingAddr = await initRoomBooking(web3, companyOneData.companyOwner, companyOneAddr, companyTwoAddr);
  logger(`RoomBooking was initialized correctly`);
  return roomBookingAddr
}

/**
 * MAIN PROGRAM
 */
initializeApp().then((roomBookingAddr) => {
  logger(`REMEMBER: Update your ".env":\n` +
    `\t...\n`+
    `\tROOM_BOOKING_CONTRACT_ADDR = "${roomBookingAddr}"\n`+
    `\t...`
  )
  logger(`Finished successfully`);
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(1)
})

