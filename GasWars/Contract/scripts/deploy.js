const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const Chimchar = await ethers.getContractFactory("Chimchar");
  
  // Deploy the contract
  const chimchar = await Chimchar.deploy();
  
  // Wait for the deployment to be mined
  await chimchar.waitForDeployment();
  
  console.log("Chimchar deployed to:", await chimchar.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});