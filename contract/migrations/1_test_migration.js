const TestToken = artifacts.require("TEST");

module.exports = function(deployer) {
  deployer.deploy(TestToken);
};