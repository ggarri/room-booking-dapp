/**
 * User: ggarrido
 * Date: 8/01/20 19:49
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Utils = require('../src/web3/utils');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Company = artifacts.require('Company');
const RoomBooking = artifacts.require('RoomBooking');

contract('RoomBooking', (accounts) => {
  const companyOneOwner = accounts[0];
  const companyOneId = 'CompanyOneId'
  const companyOneIdBytes = web3Utils.strToBytes(web3, companyOneId);
  const companyOneName = 'CompanyOneName';
  const companyOneOpenAtHour = 8;
  const companyOneCloseAtHour = 18;
  const companyOneRooms = [
    { roomId: 'C01', name: 'Room_C01', roomIdInBytes: web3Utils.strToBytes(web3, 'C01') },
    { roomId: 'C02', name: 'Room_C02', roomIdInBytes: web3Utils.strToBytes(web3, 'C02') },
  ];
  const companyOneEmployees = [
    { username: 'User1', address: accounts[2], usernameInBytes: web3Utils.strToBytes(web3, 'User1') },
    { username: 'User2', address: accounts[3], usernameInBytes: web3Utils.strToBytes(web3, 'User2') },
    { username: 'User3', address: accounts[4], usernameInBytes: web3Utils.strToBytes(web3, 'User3') }
  ];

  const companyTwoOwner = accounts[0];
  const companyTwoId = 'CompanyTwoId'
  const companyTwoIdBytes = web3Utils.strToBytes(web3, companyTwoId);
  const companyTwoName = 'CompanyTwoName';
  const companyTwoOpenAtHour = 8;
  const companyTwoCloseAtHour = 18;
  const companyTwoRooms = [
    { roomId: 'P01', name: 'Room_P01', roomIdInBytes: web3Utils.strToBytes(web3, 'P01') },
  ];
  const companyTwoEmployees = [
    { username: 'PUser1', address: accounts[5], usernameInBytes: web3Utils.strToBytes(web3, 'PUser1') },
  ];

  const notEmployeeAddr = accounts[6];

  const reservations = {
    reservationCompanyOne: {
      companyIdInBytes: companyOneIdBytes,
      roomIdInBytes: companyOneRooms[0].roomIdInBytes,
      year: 2020,
      month: 11,
      day: 1,
      hour: 9,
      id: null
    }
  }

  let companyOneInstance;
  let companyTwoInstance;
  let roomBookingInstance;

  it('should deploy a CompanyOne contract and initialize it', async () => {
    companyOneInstance = await Company.new(
      companyOneIdBytes,
      companyOneName,
      companyOneOpenAtHour,
      companyOneCloseAtHour,
      { from: companyOneOwner });

    await companyOneInstance.addRoom(companyOneRooms[0].roomIdInBytes, companyOneRooms[0].name);
    await companyOneInstance.addRoom(companyOneRooms[1].roomIdInBytes, companyOneRooms[1].name);

    await companyOneInstance.addEmployee(companyOneEmployees[0].usernameInBytes, companyOneEmployees[0].address);
    await companyOneInstance.addEmployee(companyOneEmployees[1].usernameInBytes, companyOneEmployees[1].address);
  });

  it('should deploy a CompanyTwo contract and initialize it', async () => {
    companyTwoInstance = await Company.new(
      companyTwoIdBytes,
      companyTwoName,
      companyTwoOpenAtHour,
      companyTwoCloseAtHour,
      { from: companyTwoOwner });

    await companyTwoInstance.addRoom(companyTwoRooms[0].roomIdInBytes, companyTwoRooms[0].name);
    await companyTwoInstance.addEmployee(companyTwoEmployees[0].usernameInBytes, companyTwoEmployees[0].address);
  });

  it('should deploy a new fresh RoomBooking contract', async () => {
    roomBookingInstance = await RoomBooking.new(companyOneInstance.address, { from: companyOneOwner });
    await roomBookingInstance.appendCompany(companyTwoInstance.address, { from: companyOneOwner });

    const isCompanyOneOwnerAdmin = await roomBookingInstance.isAddressAdmin(companyOneOwner);
    const isCompanyTwoOwnerAdmin = await roomBookingInstance.isAddressAdmin(companyTwoOwner);

    assert.isTrue(isCompanyOneOwnerAdmin, 'CompanyOne owner is not admin');
    assert.isTrue(isCompanyTwoOwnerAdmin, 'CompanyTwo owner is not admin');
  });

  it('should not allow to book a room to not employee', () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        resInfo.hour,
        { from: notEmployeeAddr }
      ));
  });

  it('should not allow to book a room before company opened up', () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        companyOneOpenAtHour - 1,
        { from: companyOneEmployees[0].address }
      ));
  });

  it('should not allow to book a room after company has closed', () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        companyOneCloseAtHour,
        { from: companyOneEmployees[0].address }
      ));
  });

  it('should not allow to book a not existing room', () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        web3Utils.strToBytes(web3, 'NOT_EXISTING'),
        resInfo.year,
        resInfo.month,
        resInfo.day,
        resInfo.hour,
        { from: companyOneEmployees[0].address }
      ));
  });

  it('should allow to book a room to company employee', async () => {
    const resInfo = reservations.reservationCompanyOne;
    const createResTx = await roomBookingInstance.createReservation(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour,
      { from: companyOneEmployees[0].address }
    );
    const eventArgs = web3Utils.eventArgs(createResTx, 'ReservationAdded');
    const rIdHex = eventArgs.reservationId;
    reservations.reservationCompanyOne.id = rIdHex;
    const isRoomAvailable = await roomBookingInstance.isRoomAvailable(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour
    );

    const actualReservationInfo = await roomBookingInstance.reservationInfo(rIdHex);

    assert.isFalse(isRoomAvailable, `Room should not be available`);
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.year), resInfo.year, 'Invalid reservation year');
    assert.equal(actualReservationInfo.employeeAddr, companyOneEmployees[0].address, 'Invalid reservation employee');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.month), resInfo.month, 'Invalid reservation month');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.day), resInfo.day, 'Invalid reservation day');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.hour), resInfo.hour, 'Invalid reservation hour');
  });

  it('should not allow to book a booked room', () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        resInfo.hour,
        { from: companyOneEmployees[1].address }
      ));
  });

  it('should not allow other employees to cancel a room booking', async () => {
    const resInfo = reservations.reservationCompanyOne;
    return assert.isRejected(
      roomBookingInstance.removeReservation(resInfo.id, { from: companyOneEmployees[1].address })
    );
  });

  it('should allow employee to cancel its own room booking', async () => {
    const resInfo = reservations.reservationCompanyOne;
    await roomBookingInstance.removeReservation(resInfo.id, { from: companyOneEmployees[0].address });
    const isRoomAvailable = await roomBookingInstance.isRoomAvailable(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour
    );

    assert.isTrue(isRoomAvailable, `Room should not be available`);
  });

  it('should allow to book a room of different company than employer', async () => {
    const resInfo = reservations.reservationCompanyOne;
    const createResTx = await roomBookingInstance.createReservation(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour,
      { from: companyTwoEmployees[0].address }
    );

    const eventArgs = web3Utils.eventArgs(createResTx, 'ReservationAdded');
    const rIdHex = eventArgs.reservationId;
    reservations.reservationCompanyOne.id = rIdHex;

    const isRoomAvailable = await roomBookingInstance.isRoomAvailable(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour
    );

    const actualReservationInfo = await roomBookingInstance.reservationInfo(rIdHex);

    assert.isFalse(isRoomAvailable, `Room should not be available`);
    assert.equal(actualReservationInfo.employeeAddr, companyTwoEmployees[0].address, 'Invalid reservation employee');
  });

})
