// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.11;
pragma abicoder v2;

contract HelloWorld {
    string private message;
    constructor(string memory _message) {
        message = _message;
    }

    function greet() external view returns (string memory) {
        return string(abi.encodePacked("Hello", " ", message));
    }

}
