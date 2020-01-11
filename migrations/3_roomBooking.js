/**
 * User: ggarrido
 * Date: 11/01/20 16:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Company = artifacts.require("Company");
const RoomBooking = artifacts.require("RoomBooking");

module.exports = function(deployer) {
  return Company.deployed()
    .then(companyInstance => {
      return deployer.deploy(RoomBooking, companyInstance.address);
    })
    .then((instance) => {
      console.log(`Contract "RoomBooking" deployed at: ${instance.address}`)
    })
    .catch(err => {
      console.error(err);
      throw err;
    })
}
