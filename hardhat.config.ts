import "@primitivefi/hardhat-dodoc";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// require('hardhat-ethernal');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.11",
        settings: {
            // Disable the optimizer when debugging
            // https://hardhat.org/hardhat-network/#solidity-optimizer-support
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },

    networks: {
        hardhat: {
            accounts: {
                accountsBalance: "1000000000000000000000000",
                count: 10,
            },
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
        },

        coverage: {
            url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
        },
    },

    dodoc: {
        runOnCompile: true,
        debugMode: true,
        outputDir: "./docs",
    },
};

export default config;
