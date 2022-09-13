const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld", function(){
    it("Should print a hello world greeting", async function () {
        /* Deploy the helloWorld contract */
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await helloWorldFactory.deploy("World!");
        await helloWorld.deployed();

        const greeting = await helloWorld.greet(); 
        expect(greeting).is.equal("Hello World!")
    });
});