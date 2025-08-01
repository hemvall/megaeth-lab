const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Déployé par:", deployer.address);

  // supply de base initialisé à 1 million tokens
  const initialSupply = ethers.parseEther("1000000");

  const Token = await ethers.getContractFactory("Meep");
  const token = await Token.deploy(initialSupply);

  await token.waitForDeployment();

  const address = token.target;

  console.log("MonToken déployé à:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
