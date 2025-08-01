const { expect } = require("chai");

describe("Meep Token", function () {
  let Meep, meep, owner, addr1;

  beforeEach(async function () {
    Meep = await ethers.getContractFactory("Meep");
    [owner, addr1] = await ethers.getSigners();
    meep = await Meep.deploy(ethers.parseUnits("1000", 18));
    await meep.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await meep.name()).to.equal("Meep");
    expect(await meep.symbol()).to.equal("MEEP");
  });

  it("should mint initial supply to owner", async function () {
    const balance = await meep.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseUnits("1000", 18));
  });

  it("should allow owner to mint more tokens", async function () {
    await meep.mint(addr1.address, ethers.parseUnits("500", 18));
    const balance = await meep.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseUnits("500", 18));
  });

  it("should allow transfers between addresses", async function () {
    await meep.transfer(addr1.address, ethers.parseUnits("100", 18));
    const balance = await meep.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseUnits("100", 18));
  });

  it("should allow approve and transferFrom", async function () {
    await meep.approve(addr1.address, ethers.parseUnits("200", 18));
    expect(await meep.allowance(owner.address, addr1.address)).to.equal(ethers.parseUnits("200", 18));
  });
});
