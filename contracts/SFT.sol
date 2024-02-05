// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@solvprotocol/erc-3525/ERC3525.sol";

contract SFT is Ownable, ERC3525 {
    using Strings for uint256;

    mapping(address => uint) public userAddressToSftId;

    uint public _tokenID = 1;
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
        storeUserAddress();
        idGenerator();
    }

    function storeUserAddress() public {
        uint userId = getTokenId();
        userAddressToSftId[msg.sender] = userId; // make it another function for clean code
    }

    function idGenerator() public {
        _tokenID++;
    }

    function userSftChecker(address userAddress) public view returns (bool) {
        uint userTokenId = getUserSftId(userAddress);

        // sftIdValidation(userTokenId);
    }

    function getUserSftId(address userAddress) public view returns (uint tokenId) {
        return userAddressToSftId[userAddress];
    }

    function getTokenId() public view returns (uint id) {
        return _tokenID;
    }
}
