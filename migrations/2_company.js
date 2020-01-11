/**
 * User: ggarrido
 * Date: 11/01/20 16:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Company = artifacts.require("Company");
const web3Utils = require('../src/web3/utils');

module.exports = function(deployer) {
  const companyId = web3Utils.strToBytes(web3, "CompanyId");
  const companyName = "CompanyName";
  const openAtHour = 8;
  const closeAtHour = 18;

  return deployer
    .deploy(Company, companyId, companyName, openAtHour, closeAtHour)
    .then((instance) => {
      console.log(`Contract "Company" deployed at: ${instance.address}`)
    })
    .catch(err => {
      console.error(err);
      throw err;
    })
}
