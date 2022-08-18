const { expect } = require("chai");
const { ethers } = require("hardhat");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18; 
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
    const simpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress);
    await simpleSwap.deployed();
    let signers = await hre.ethers.getSigners();

    /* Connect to WETH and wrap some eth  */
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
    const deposit = await WETH.deposit({ value: hre.ethers.utils.parseEther("10") });
    await deposit.wait();
    
    /* Check Initial DAI Balance */ 
    const DAI = new hre.ethers.Contract(DAI_ADDRESS, ercAbi, signers[0]);
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);
    const DAIBalanceBefore = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS));

    /* Approve the swapper contract to spend WETH for me */
    await WETH.approve(simpleSwap.address, hre.ethers.utils.parseEther("1"));
    
    /* Execute the swap */
    const amountIn = hre.ethers.utils.parseEther("0.1"); 
    const swap = await simpleSwap.swapWETHForDAI(amountIn, { gasLimit: 300000 });
    swap.wait(); 
    
    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address);
    const DAIBalanceAfter = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS));
    
    expect( DAIBalanceAfter )
      .is.greaterThan(DAIBalanceBefore); 
  });
});
