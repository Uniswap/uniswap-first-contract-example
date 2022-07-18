// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.6;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

contract BasicV3Oracle {
    address public immutable tokenIn; 
    address public immutable tokenOut; 
    address public immutable pool; 

    constructor (address _factory, address _tokenIn, address _tokenOut, uint24 _fee) {
        address _pool = IUniswapV3Factory(_factory).getPool(_tokenIn, _tokenOut, _fee);
        require(_pool != address(0), "No pool found!"); 
        pool = _pool; 
        tokenIn = _tokenIn; 
        tokenOut = _tokenOut; 
    }

    function getPrice(uint128 tokenInAmount, uint32 secondsAgo ) public view returns (uint tokenOutAmount) {
        (int24 tick, ) = OracleLibrary.consult(pool, secondsAgo);
        return OracleLibrary.getQuoteAtTick(
            tick,
            tokenInAmount,
            tokenIn,
            tokenOut
        );
    }
}

