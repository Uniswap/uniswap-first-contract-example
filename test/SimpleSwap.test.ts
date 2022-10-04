import { expect } from "chai";
import { ethers } from "hardhat";

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const account = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";

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

    /* Connect to weth and wrap some eth  */
    const [user] = await ethers.getSigners();
    console.log(user.address);
    const weth = await ethers.getContractAt("IWETH", WETH_ADDRESS);
    await weth.connect(user).approve(account, 10);
    await weth.connect(user).deposit({ value: 10 });
    await weth.balanceOf(user.address).then((result) => {
      console.log(result);
    });

    /* Check Initial DAI Balance */
    const dai = await ethers.getContractAt("IERC20", DAI_ADDRESS);
    await dai.balanceOf(user.address).then((result) => {
      console.log(result);
    });
    /* Approve the swapper contract to spend weth for me */
    await weth.connect(user).approve(simpleSwap.address, 10);
    /* Execute the swap */
    await simpleSwap.swapExactInputSingleHop(
      WETH_ADDRESS,
      DAI_ADDRESS,
      3000,
      10,
      { from: user.address }
    );
    /* Check DAI end balance */
    await dai.balanceOf(user.address).then((result) => {
      console.log(result);
    });
    /* Test that we now have more DAI than when we started */
  });
});
