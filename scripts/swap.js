const hre = require("hardhat");
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

async function main() {
  const Swapper = await hre.ethers.getContractFactory("SimpleSwap");
  const swapper = await Swapper.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");
  
  
  /* Deploy the swapper contract */
  await swapper.deployed();
  console.log("Swapper deployed to:", swapper.address);
  let signers = await hre.ethers.getSigners();

  /* Connect to weth9 and wrap some eth */
  const weth9 = new hre.ethers.Contract(wethAddress, ercAbi, signers[0]);
  let transaction = await weth9.deposit({ value: hre.ethers.utils.parseEther("10") });
  await transaction.wait();
  let sym = await weth9.balanceOf(signers[0].address);
  console.log("Current balance: " + hre.ethers.utils.formatEther(sym) + " WETH");
  
  /* Approve the swapper contract to spend weth9 for me */
  let approve = await weth9.approve(swapper.address, hre.ethers.utils.parseEther("10"));
  approve = approve ? "was": "was not" ; 
  console.log("Transaction " + approve + " approved"); 
  // transaction = await weth9.transfer(swapper.address, hre.ethers.utils.parseEther("1"), { gasLimit: 300000 });

  /* Execute the swap */
  const amountIn = "0.1"; 
  let txn = await swapper.swapExactInputSingle(hre.ethers.utils.parseEther(amountIn), { gasLimit: 300000 });
  txn.wait(); 
  console.log("Swapped " + amountIn + "WETH for " + txn.value + " DAI");
  
  /* Check DAI balance */
  const DAI = new hre.ethers.Contract(DAIAddress, ercAbi, signers[0]);
  let daiOut = await DAI.balanceOf(signers[0].address);
  console.log("Current balance: " + hre.ethers.utils.formatEther(daiOut) + " DAI");

  let poolBalance = await DAI.balanceOf("0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8");
  console.log(hre.ethers.utils.formatEther(poolBalance))
  poolBalance = await weth9.balanceOf("0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8");
  console.log(hre.ethers.utils.formatEther(poolBalance))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
