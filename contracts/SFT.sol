// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@solvprotocol/erc-3525/ERC3525.sol";

contract SFT is Ownable, ERC3525 {
    using Strings for uint256;
    // address private owner;
    uint public tokenValue = 0;

    constructor() Ownable(msg.sender) ERC3525("alireza", "AZK", 18) {}

    // function setNewTokenValue(uint _newTokenValue) public onlyOwner {
    //     tokenValue = _newTokenValue;
    // }
}
