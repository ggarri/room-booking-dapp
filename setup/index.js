/**
 * User: ggarrido
 * Date: 8/01/20 19:49
 * Copyright 2019 (c) Lightstreams, Granada
 */
require('dotenv').config()

const Debug = require('debug');
const web3Wrapper = require('../src/web3/wrapper');
const { web3cfg } = require('../src/config');


const logger = Debug('app:setup');
const companyContractWrapper = require('../src/company/contract');
const roomBookingContractWrapper = require('../src/roomBooking/contract');


async function initCompany(web3, companyInfo) {
  const companyOneAddr = await companyContractWrapper.deploy(web3, {
    from: companyInfo.companyOwner
  }, {
    companyName: companyInfo.companyName,
    companyId: companyInfo.companyId,
    openAt: companyInfo.openAt,
    closeAt: companyInfo.closeAt,
  });

  for(const employee in companyInfo.employees) {
    await companyContractWrapper.addEmployee(web3, {
      contractAt: companyOneAddr,
      from: companyInfo.companyOwner
    }, {
      employeeAddr: employee.address,
      employeeUsername: employee.username,
    })
  }

  for ( const room in companyInfo.rooms ) {
    await companyContractWrapper.addRoom(web3, {
      contractAt: companyOneAddr,
      from: companyInfo.companyOwner
    }, {
      roomId: room.id,
      roomName: room.name,
    })
  }

  return companyOneAddr;
}

async function initRoomBooking(web3, companyOneOwnerAddr, companyOneAddr, companyTwoAddr = null) {
  const roomBookingAddr = await roomBookingContractWrapper.deploy(web3, {
    from: companyOneOwnerAddr
  }, {
    companyAddr: companyOneAddr
  });

  if(companyTwoAddr) {
    roomBookingContractWrapper.appendCompany(web3, {
      from: companyOneOwnerAddr,
    }, {
      companyAddr: companyTwoAddr
    })
  }

  return roomBookingAddr;
}

async function initializeApp() {
  logger(`Using web3 provider: ${web3cfg.provider}`);

  const web3 = web3Wrapper.newEngine(web3cfg.provider);
  const companyOneData = require('./companyOne.json');
  const companyTwoData = require('./companyTwo.json');

  const companyOneAddr = await initCompany(web3, companyOneData);
  logger(`CompanyOne "${companyOneData.companyName}" deployed at: ${companyOneAddr}`);

  const companyTwoAddr = await initCompany(web3, companyTwoData);
  logger(`CompanyTwo "${companyTwoData.companyName}" deployed at: ${companyTwoAddr}`);

  const roomBookingAddr = await initRoomBooking(web3, companyOneData.companyOwner, companyOneAddr, companyTwoAddr);
  logger(`RoomBooking deployed at: ${roomBookingAddr} (REMEMBER !!! update your '.env')`);
}

/**
 * MAIN EXECUTION
 */
initializeApp().then(() => {
    process.exit(0)
  }).catch(err => {
  console.error(err);
  process.exit(1)
})

