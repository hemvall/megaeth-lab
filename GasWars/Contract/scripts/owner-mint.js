const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0]; // Owner who can open mint
  const minter = signers[1];   // Account that will mint the NFT
  
  console.log("Available accounts:");
  console.log("  Deployer (owner):", await deployer.getAddress());
  console.log("  Minter:", await minter.getAddress());
  
  // Get contract
  const Chimchar = await ethers.getContractFactory("Chimchar");
  const chimchar = Chimchar.attach(contractAddress);
  
  console.log("\n🔥 Minting NFT for:", await minter.getAddress());
  
  // 1. Open mint (deployer is the owner)
  await chimchar.connect(deployer).openMint();
  console.log("✅ Mint opened");
  
  // 2. Mint to the minter account
  const tx = await chimchar.connect(minter).mint({ value: ethers.parseEther("0.1") });
  await tx.wait();
  console.log("✅ NFT minted!");
  
  // 3. Show results
  const totalSupply = await chimchar.totalSupply();
  const balance = await chimchar.balanceOf(await minter.getAddress());
  const tokenURI = await chimchar.tokenURI(0);
  const tokenOwner = await chimchar.ownerOf(0);
  
  console.log("\n📊 Results:");
  console.log("Total NFTs:", totalSupply.toString());
  console.log("Minter NFT balance:", balance.toString());
  console.log("Token 0 owner:", tokenOwner);
  console.log("Token 0 URI:", tokenURI);
  console.log("✅ Successfully minted token ID 0!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});