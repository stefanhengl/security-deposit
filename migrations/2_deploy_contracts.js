var SecurityDeposit = artifacts.require("./SecurityDeposit.sol");

module.exports = function(deployer) {
  deployer.deploy(SecurityDeposit);
};
