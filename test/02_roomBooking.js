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
  const companyOwner = accounts[0];
  const companyId = 'CompanyId'
  const companyIdBytes = web3Utils.strToBytes(web3, companyId);
  const companyName = 'CompanyName';
  const openAtHour = 8;
  const closeAtHour = 18;

  const rooms = [
    { roomId: 'C01', name: 'Room_C01', roomIdInBytes: web3Utils.strToBytes(web3, 'C01') },
    { roomId: 'C02', name: 'Room_C02', roomIdInBytes: web3Utils.strToBytes(web3, 'C02') },
    { roomId: 'C03', name: 'Room_C03', roomIdInBytes: web3Utils.strToBytes(web3, 'C03') }
  ];

  const employees = [
    { username: 'User1', address: accounts[1], usernameInBytes: web3Utils.strToBytes(web3, 'User1') },
    { username: 'User2', address: accounts[2], usernameInBytes: web3Utils.strToBytes(web3, 'User2') },
    { username: 'User3', address: accounts[3], usernameInBytes: web3Utils.strToBytes(web3, 'User3') }
  ];
  const notEmployeeAddr = accounts[4];

  const reservations = {
    reservation1: {
      companyIdInBytes: companyIdBytes,
      roomIdInBytes: rooms[0].roomIdInBytes,
      year: 2020,
      month: 11,
      day: 1,
      hour: 9,
      id: null
    }
  }

  let companyInstance;
  let roomBookingInstance;

  it('should deploy a new fresh Company contract and initialize it', async () => {
    companyInstance = await Company.new(
      companyIdBytes,
      companyName,
      openAtHour,
      closeAtHour,
      { from: companyOwner });

    await companyInstance.addRoom(rooms[0].roomIdInBytes, rooms[0].name);
    await companyInstance.addRoom(rooms[1].roomIdInBytes, rooms[2].name);

    await companyInstance.addEmployee(employees[0].usernameInBytes, employees[0].address);
    await companyInstance.addEmployee(employees[1].usernameInBytes, employees[2].address);
  });

  it('should deploy a new fresh RoomBooking contract', async () => {
    roomBookingInstance = await RoomBooking.new(companyInstance.address, { from: companyOwner });

    const isCompanyOwnerAdmin = await roomBookingInstance.isAddressAdmin(companyOwner);
    assert.isTrue(isCompanyOwnerAdmin, 'Company owner is not admin');
  });

  it('should not allow to book a room to not employee', () => {
    const resInfo = reservations.reservation1;
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
    const resInfo = reservations.reservation1;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        openAtHour - 1,
        { from: employees[0].address }
      ));
  });

  it('should not allow to book a room after company has closed', () => {
    const resInfo = reservations.reservation1;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        closeAtHour,
        { from: employees[0].address }
      ));
  });

  it('should not allow to book a not existing room', () => {
    const resInfo = reservations.reservation1;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        web3Utils.strToBytes(web3, 'NOT_EXISTING'),
        resInfo.year,
        resInfo.month,
        resInfo.day,
        resInfo.hour,
        { from: employees[0].address }
      ));
  });

  it('should allow to book a room to company employee', async () => {
    const resInfo = reservations.reservation1;
    const createResTx = await roomBookingInstance.createReservation(
      resInfo.companyIdInBytes,
      resInfo.roomIdInBytes,
      resInfo.year,
      resInfo.month,
      resInfo.day,
      resInfo.hour,
      { from: employees[0].address }
    );
    const eventArgs = web3Utils.eventArgs(createResTx, 'ReservationAdded');
    const rIdHex = eventArgs.reservationId;
    reservations.reservation1.id = rIdHex;
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
    assert.equal(actualReservationInfo.employeeAddr, employees[0].address, 'Invalid reservation employee');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.month), resInfo.month, 'Invalid reservation month');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.day), resInfo.day, 'Invalid reservation day');
    assert.equal(web3Utils.bnToInt(web3, actualReservationInfo.hour), resInfo.hour, 'Invalid reservation hour');
  });

  it('should not allow to book a booked room', () => {
    const resInfo = reservations.reservation1;
    return assert.isRejected(
      roomBookingInstance.createReservation(
        resInfo.companyIdInBytes,
        resInfo.roomIdInBytes,
        resInfo.year,
        resInfo.month,
        resInfo.day,
        resInfo.hour,
        { from: employees[1].address }
      ));
  });

  it('should not allow other employees to cancel a room booking', async () => {
    const resInfo = reservations.reservation1;
    return assert.isRejected(
      roomBookingInstance.removeReservation(resInfo.id, { from: employees[1].address })
    );
  });

  it('should allow employee to cancel its own room booking', async () => {
    const resInfo = reservations.reservation1;
    await roomBookingInstance.removeReservation(resInfo.id, { from: employees[0].address });
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

})
