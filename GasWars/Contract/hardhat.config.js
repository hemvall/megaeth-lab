require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    megaeth: {
      url: "https://carrot.megaeth.com/rpc", // RPC officiel MegaETH
      chainId: 6342,
      accounts: ["0xd233edb452afd65bb9938aa0c6994bc3b2a1566f95cf9134bdb0b43b2cecf9c4"] // Mets ici ta clé privée SANS le 0x
    }
  }
};