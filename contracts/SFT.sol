// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@solvprotocol/erc-3525/ERC3525.sol";

contract SFT is Ownable, ERC3525 {
    using Strings for uint256;

    uint public _tokenPrice = 0;
    uint public _slot = 0;
    uint public _tokenValue = 1;

    constructor() Ownable(msg.sender) ERC3525("alireza", "AZK", 18) {}

    function setNewTokenPrice(uint _newTokenPrice) public onlyOwner {
        _tokenPrice = _newTokenPrice;
    }

    function mint() public payable {
        require(msg.value == _tokenPrice, "Incorrect value sent for minting");
        ERC3525._mint(msg.sender, _slot, _tokenValue);
        // storeUserAddress(); // function for store user address in the mapping
        // idGenerator(); // function for generate new user Sft Id for next user
    }
}
