const NftTicketEscrow = artifacts.require("NftTicketEscrow");

module.exports = function (deployer) {
  deployer.deploy(NftTicketEscrow);
};
