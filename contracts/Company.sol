pragma solidity ^0.5.0;

import "./utils/Ownable.sol";

/**
 * @title Company: This contract stores enterprise information such a available rooms and employees
 * @author Gabriel Garrido
 */
contract Company is Ownable {

    struct Room {
        bytes32 roomId; // Limited to 32 chars
        string name;
    }

    struct Employee {
        address addr;
        bytes32 username; // Limited to 32 chars
    }

    // Company information
    bytes32 public _companyId;
    string _companyName;

    uint8 public _openAtHour; // 24h format
    uint8 public _closeAtHour; // 24h format

    // List of room ids
    bytes32[] public _roomIds;
    // Map of rooms and its info
    mapping(bytes32 => Room) public _roomId2Room;

    // List of employee's addresses
    address[] public _employeeAddrs;
    // Map of employee's address to employee info
    mapping(address => Employee) public _addr2Employee;

    event RoomAdded(bytes32 roomId);
    event RoomRemoved(bytes32 roomId);
    event EmployeeAdded(bytes32 username, address addr);
    event EmployeeRemoved(address addr);

    constructor(bytes32 companyId, string memory companyName, uint8 openAtHour, uint8 closeAtHour) public {
        _companyId = companyId;
        _companyName = companyName;
        _openAtHour = openAtHour;
        _closeAtHour = closeAtHour;
    }

    /*
     * ROOM MANAGING
    */
    function addRoom(bytes32 roomId, string memory name) onlyOwner public {
        require(_roomId2Room[roomId].roomId == "", "RoomId is already in use.");
        _roomIds.push(roomId);
        _roomId2Room[roomId] = Room({
            roomId : roomId,
            name : name
            });

        emit RoomAdded(roomId);
    }

    function removeRoom(bytes32 roomId) onlyOwner public {
        (uint idx, bool exists) = _getRoomIndex(roomId);
        if (!exists) {
            revert("RoomId does not exists");
        }

        _roomIds[idx] = _roomIds[_roomIds.length - 1];
        _roomIds.length--;

        emit RoomRemoved(roomId);
    }

    function _getRoomIndex(bytes32 roomId) internal view returns (uint index, bool exists) {
        for (uint idx = 0; idx <= _roomIds.length - 1; idx++) {
            if (_roomIds[idx] == roomId) return (idx, true);
        }

        return (0, false);
    }

    function getRoomInfo(bytes32 rId) public view returns (bytes32 roomId, string memory name) {
        return (_roomId2Room[rId].roomId, _roomId2Room[rId].name);
    }


    /*
     * EMPLOYEE MANAGING
    */

    function addEmployee(bytes32 username, address addr) onlyOwner public {
        require(_addr2Employee[addr].addr == address(0x0), "Address is already in use.");
        // @TODO: Verify username is not duplicated
        _employeeAddrs.push(addr);
        _addr2Employee[addr] = Employee({
            username : username,
            addr : addr
            });

        emit EmployeeAdded(username, addr);
    }

    function removeEmployee(address addr) onlyOwner public {
        (uint idx, bool exists) = _getEmployeeIndex(addr);
        if (!exists) {
            revert("Employee does not exists");
        }

        _employeeAddrs[idx] = _employeeAddrs[_employeeAddrs.length - 1];
        _employeeAddrs.length--;

        emit EmployeeRemoved(addr);
    }

    function _getEmployeeIndex(address addr) internal view returns (uint index, bool exists) {
        for (uint idx = 0; idx <= _employeeAddrs.length - 1; idx++) {
            if (_employeeAddrs[idx] == addr) return (idx, true);
        }

        return (0, false);
    }

    function getEmployeeAddr(bytes32 username) public view returns (address) {
        for (uint idx = 0; idx <= _employeeAddrs.length - 1; idx++) {
            address addr = _employeeAddrs[idx];
            if (_addr2Employee[addr].username == username) return addr;
        }

        return address(0x0);
    }

    function getEmployeeUsername(address addr) public view returns (bytes32) {
        return _addr2Employee[addr].username;
    }

    function isEmployee(address addr) public view returns (bool) {
        return _addr2Employee[addr].addr != address(0x0);
    }
}
