const TestNFT = artifacts.require("TESTNft");

module.exports = function(deployer) {
  deployer.deploy(TestNFT);
};