const hre = require("hardhat");

const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"; 
// WETH
const TOKEN_IN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DECIMALS_IN = 18n; 

// USDC
const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DECIMALS_OUT =  6n; 

const FEE = 3000; 

const main = async () => {
    const Oracle = await hre.ethers.getContractFactory("BasicV3Oracle");
    const oracle = await Oracle.deploy(FACTORY_ADDRESS, TOKEN_IN, TOKEN_OUT, FEE);

    await oracle.deployed();
    let amountIn = 10n ** DECIMALS_IN; 
    let price = await oracle.getPrice(amountIn, 100);
    let outputPrice = BigInt(price) / 10n ** DECIMALS_OUT; 
    console.log("Price: " + outputPrice);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });