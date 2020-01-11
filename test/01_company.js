/**
 * User: ggarrido
 * Date: 8/01/20 19:49
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Utils = require('../src/web3/utils');

const Company = artifacts.require('Company');

contract('Company', (accounts) => {
  const companyOwner = accounts[0];
  const companyId = 'CompanyId'
  const companyIdBytes = web3Utils.strToBytes(web3, companyId);
  const companyName = 'CompanyName';
  const openAtHour = 8;
  const closeAtHour = 18;

  const rooms = [
    { roomId: 'C01', name: 'Room_C01', roomIdInBytes: web3Utils.strToBytes(web3, 'C01') },
  ];

  const employees = [
    { username: 'User1', address: accounts[1], usernameInBytes: web3Utils.strToBytes(web3, 'User1') },
  ];

  let companyInstance;

  it('should deploy a new fresh Company contract', async () => {
    companyInstance = await Company.new(
      companyIdBytes,
      companyName,
      openAtHour,
      closeAtHour,
      { from: companyOwner });

    const actualOwner = await companyInstance.getOwner();
    assert.equal(actualOwner, companyOwner, 'Not expected "Company" contract owner');
  });

  it('should add a new room to Company', async () => {
    const expectedRoom = rooms[0];

    await companyInstance.addRoom(expectedRoom.roomIdInBytes, expectedRoom.name);
    const { roomId: actualRoomIdHex, name: actualRoomName } = await companyInstance.getRoomInfo(expectedRoom.roomIdInBytes);
    const roomExists = await companyInstance.roomExists(expectedRoom.roomIdInBytes);

    assert.isTrue(roomExists, 'Room was not added');
    assert.equal(actualRoomName, expectedRoom.name, 'Not expected Room.name stored');
    assert.equal(web3Utils.hexToStr(web3, actualRoomIdHex), expectedRoom.roomId, 'Not expected Room.roomId stored');
  });

  it('should remove inserted room from Company', async () => {
    const removeRoom = rooms[0];

    await companyInstance.removeRoom(removeRoom.roomIdInBytes);
    const roomExists = await companyInstance.roomExists(removeRoom.roomIdInBytes);

    assert.isFalse(roomExists, 'Room was not removed');
  });

  it('should add a new employee to Company', async () => {
    const expectedEmployee = employees[0];

    await companyInstance.addEmployee(expectedEmployee.usernameInBytes, expectedEmployee.address);
    const employeeExists = await companyInstance.employeeExists(expectedEmployee.address);
    const actualEmployeeAddr = await companyInstance.getEmployeeAddr(expectedEmployee.usernameInBytes);
    const actualEmployeeUsernameHex = await companyInstance.getEmployeeUsername(expectedEmployee.address);

    assert.isTrue(employeeExists, 'Employee was not added');
    assert.equal(actualEmployeeAddr, expectedEmployee.address, 'Not expected Employee.address stored');
    assert.equal(web3Utils.hexToStr(web3, actualEmployeeUsernameHex), expectedEmployee.username, 'Not expected Employee.username stored');
  });

  it('should remove inserted room from Company', async () => {
    const removeEmployee = employees[0];

    await companyInstance.removeEmployee(removeEmployee.address);
    const employeeExists = await companyInstance.employeeExists(removeEmployee.address);

    assert.isFalse(employeeExists, 'Employee was not removed');
  });
})
