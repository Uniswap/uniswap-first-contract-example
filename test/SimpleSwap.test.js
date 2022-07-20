const { expect } = require("chai");
const { ethers } = require("hardhat");

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

describe("SimpleSwap", function () {
  it("Should provide a caller with more DAI than they started with after a swap", async function () {
    
    /* Deploy the SimpleSwap contract */
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await SimpleSwap.deploy(SwapRouterAddress);
    await simpleSwap.deployed();
    let signers = await hre.ethers.getSigners();

    /* Connect to weth9 and wrap some eth  */
    const weth9 = new hre.ethers.Contract(wethAddress, ercAbi, signers[0]);
    let transaction = await weth9.deposit({ value: hre.ethers.utils.parseEther("10") });
    await transaction.wait();
    
    /* Check Initial DAI Balance */ 
    const DAI = new hre.ethers.Contract(DAIAddress, ercAbi, signers[0]);
    let daiInWalletStart = await DAI.balanceOf(signers[0].address);
    daiInWalletStart = Number(hre.ethers.utils.formatEther(daiInWalletStart));

    /* Approve the swapper contract to spend weth9 for me */
    let approval = await weth9.approve(simpleSwap.address, hre.ethers.utils.parseEther("1"));
    
    /* Execute the swap */
    const amountIn = "0.1"; 
    let txn = await simpleSwap.swapWethForDAI(hre.ethers.utils.parseEther(amountIn), { gasLimit: 300000 });
    txn.wait(); 
    
    /* Check DAI end balance */
    let daiInWalletEnd = await DAI.balanceOf(signers[0].address);
    daiInWalletEnd = Number(hre.ethers.utils.formatEther(daiInWalletEnd));
    
    expect( daiInWalletEnd )
      .is.greaterThan(daiInWalletStart); 
  });
});