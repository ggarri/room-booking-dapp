pragma solidity ^0.5.0;

import "./Company.sol";

contract RoomBooking {

    struct Reservation {
        bytes32 reservationId;
        address employeeAddr;
        uint8 year;
        uint8 month;
        uint8 day;
        uint8 hour;
    }

    modifier onlyCompanyOwners(address addr) {
        require(_isCompanyOwner(addr));
        _;
    }

    // @TODO Decide if we want to include company address as employee
    modifier onlyCompanyEmployee(address addr) {
        require(_isCompanyEmployee(addr));
        _;
    }

    // List of companies included in the booking engine
    Company[] _companies;

    // List of reservations in the system
    mapping(bytes32 => Reservation) _reservations;


    event CompanyAdded(bytes32 companyId);
    event CompanyRemoved(bytes32 companyId);
    event ReservationAdded(bytes32 reservationId, bytes32 companyId, bytes32 roomId);
    event ReservationRemoved(bytes32 reservationId);

    constructor(Company company) public {
        _companies.push(company);
    }

    /*
     * COMPANIES MANAGING
    */

    function appendCompany(Company company) onlyCompanyOwners(msg.sender) public {
        (uint idx, bool exists) = _getCompanyIndex(company._companyId());
        if (exists) {
            revert("Company was already added");
        }

        // @TODO Validate if company was already added
        _companies.push(company);
    }

    function removeCompany(bytes32 companyId) onlyCompanyOwners(msg.sender) public {
        (uint idx, bool exists) = _getCompanyIndex(companyId);

        if (!exists) {
            revert("Company does not exists");
        }

        Company company = _companies[idx];
        _companies[idx] = _companies[_companies.length - 1];
    }

    function _getCompanyIndex(bytes32 companyId) internal view returns (uint index, bool exists) {
        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx]._companyId() == companyId) return (idx, true);
        }

        return (0, false);
    }

    /*
     * ROOM BOOKING
    */

    function createReservation(bytes32 companyId, bytes32 roomId, uint8 year, uint8 month, uint8 day, uint8 hour)
    onlyCompanyEmployee(msg.sender) public returns (bytes32) {
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

        return reservationId;
    }


    function removeReservation(bytes32 reservationId) onlyCompanyEmployee(msg.sender) public {
        require(_reservations[reservationId].employeeAddr != address(0x0), "Reservation is not in the system");
        _reservations[reservationId].employeeAddr = address(0x0);
    }

    function isRoomAvailable(bytes32 companyId, bytes32 roomId, uint8 year, uint8 month, uint8 day, uint hour)
    public view returns (bool) {
        bytes32 reservationId = _reservationMapKey(companyId, roomId, year, month, day, hour);
        return _reservations[reservationId].employeeAddr != address(0x0);
    }


    /*
     * HELPERS
    */

    function _isCompanyOwner(address addr) internal view returns (bool) {
        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx].getOwner() == addr) return true;
        }
        return false;
    }

    function _isCompanyEmployee(address addr) internal view returns (bool) {
        for (uint idx = 0; idx <= _companies.length - 1; idx++) {
            if (_companies[idx].isEmployee(addr)) return true;
        }
        return false;
    }

    function _reservationMapKey(bytes32 companyId, bytes32 roomId, uint8 year, uint8 month, uint8 day, uint hour)
    internal view returns (bytes32) {
        return sha256(abi.encodePacked(companyId, roomId, year, month, day, hour));
    }
}
