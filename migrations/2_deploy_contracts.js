let SecurityDepositFactory = artifacts.require('./SecurityDepositFactory.sol')

module.exports = function (deployer) {
  deployer.deploy(SecurityDepositFactory)
}
