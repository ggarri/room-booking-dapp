pragma solidity ^0.5.0;

import "./Company.sol";

contract RoomBooking {

    struct Reservation {
        bytes32 reservationId;
        address employeeAddr;
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 hour;
    }

    modifier onlyAdmin(address addr) {
        require(_isCompanyOwner(addr));
        _;
    }

    // @TODO Decide if we want to include company address as employee
    modifier onlyEmployees(address addr) {
        require(_isCompanyEmployee(addr));
        _;
    }

    // List of companies included in the booking engine
    Company[] _companies;

    // List of reservations in the system
    mapping(bytes32 => Reservation) _reservations;


    event CompanyAdded(bytes32 companyId, uint idx);
    event CompanyRemoved(bytes32 companyId);
    event ReservationAdded(bytes32 reservationId, bytes32 companyId, bytes32 roomId);
    event ReservationRemoved(bytes32 reservationId);

    constructor(Company company) public {
        _companies.push(company);
    }

    function isAddressAdmin(address addr) public view returns (bool) {
        return _isCompanyOwner(addr);
    }

    /*
     * COMPANIES MANAGING
    */

    function appendCompany(Company company) onlyAdmin(msg.sender) public {
        (uint idx, bool exists) = _getCompanyIndex(company._companyId());
        if (exists) {
            revert("Company was already added");
        }

        _companies.push(company);
        emit CompanyAdded(company._companyId(), _companies.length -1);
    }

    function removeCompany(bytes32 companyId) onlyAdmin(msg.sender) public {
        (uint idx, bool exists) = _getCompanyIndex(companyId);

        if (!exists) {
            revert("Company does not exists");
        }

        Company company = _companies[idx];
        _companies[idx] = _companies[_companies.length - 1];
        emit CompanyRemoved(companyId);
    }

    /*
     * ROOM BOOKING
    */

    function createReservation(bytes32 companyId, bytes32 roomId, uint16 year, uint8 month, uint8 day, uint8 hour)
    onlyEmployees(msg.sender) public {
        (uint companyIdx, bool exists) = _getCompanyIndex(companyId);

        Company company = Company(_companies[companyIdx]);
        require(exists, "Company does not exists");
        require(company.roomExists(roomId), "Room does not exists");
        require(company.isBuildingOpen(hour), "Company is not open");

        bytes32 reservationId = _reservationMapKey(companyId, roomId, year, month, day, hour);

        if(_reservations[reservationId].employeeAddr != address(0x0)) revert("Room is not available");

        _reservations[reservationId] = Reservation({
            reservationId : reservationId,
            employeeAddr : msg.sender,
            year : year,
            month : month,
            day : day,
            hour : hour
            });

        emit ReservationAdded(reservationId, companyId, roomId);
    }


    function removeReservation(bytes32 reservationId) onlyEmployees(msg.sender) public {
        require(_reservations[reservationId].employeeAddr != address(0x0), "Reservation is not in the system");
        require(_reservations[reservationId].employeeAddr == msg.sender, "Cancellation is not authorized");
        _reservations[reservationId].employeeAddr = address(0x0);
        emit ReservationRemoved(reservationId);
    }

    function isRoomAvailable(bytes32 companyId, bytes32 roomId, uint16 year, uint8 month, uint8 day, uint8 hour)
    public view returns (bool) {
        bytes32 reservationId = _reservationMapKey(companyId, roomId, year, month, day, hour);
        return _reservations[reservationId].employeeAddr == address(0x0);
    }

    function reservationInfo(bytes32 rId) public view
    returns (address employeeAddr, uint16 year, uint8 month, uint8 day, uint8 hour) {
        return (
        _reservations[rId].employeeAddr,
        _reservations[rId].year,
        _reservations[rId].month,
        _reservations[rId].day,
        _reservations[rId].hour
        );
    }


    /*
     * HELPERS
    */

    function _isCompanyOwner(address addr) internal view returns (bool) {
        if (_companies.length == 0) return false;

        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx].getOwner() == addr) return true;
        }
        return false;
    }

    function _getCompanyIndex(bytes32 companyId) internal view returns (uint index, bool exists) {
        if (_companies.length == 0) return (0, false);

        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx]._companyId() == companyId) return (idx, true);
        }

        return (0, false);
    }

    function _isCompanyEmployee(address addr) internal view returns (bool) {
        if (_companies.length == 0) return false;

        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx].employeeExists(addr)) return true;
        }
        return false;
    }

    function _reservationMapKey(bytes32 companyId, bytes32 roomId, uint16 year, uint8 month, uint8 day, uint8 hour)
    internal view returns (bytes32) {
        return sha256(abi.encodePacked(companyId, roomId, year, month, day, hour));
    }
}
