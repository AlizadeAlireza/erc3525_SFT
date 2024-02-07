// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@solvprotocol/erc-3525/ERC3525.sol";

contract SFT is Ownable, ERC3525 {
    using Strings for uint256;

    /* Errors */
    error SFT__YouAlreadyHaveSFT();
    error SFT__IncorrectValueSentForMinting();
    error SFT__CallerIsNotTheOwner();

    /* State variables */

    uint public _tokenID = 1;
    uint public _tokenPrice = 10;
    uint public _slot = 0;
    uint public _tokenValue = 1;

    // it is simple metadata
    string public constant tokenUri =
        "https://ipfs.filebase.io/ipfs/QmdC8CMNnD36DT4uhrR3c2rohHpMGdiSqZeiJngs23MYtH";

    /* Type declarations */
    mapping(address => uint) public userAddressToSftId;
    mapping(uint => uint) public userSftPrice;

    /* Events */
    event SetNewTokenPriceByOwenr(address owner, uint newSftPrice);
    event SftMintByUser(address user, uint tokenId, uint tokenValue, uint currentSftPrice);
    event SftNewPriceByHolder(address sftOwner, uint newOwnedSftPrice, uint tokenId);

    /* main functions */
    constructor() Ownable(msg.sender) ERC3525("alireza", "AZK", 18) {}

    function setNewTokenPrice(uint _newTokenPrice) public onlyOwner {
        _tokenPrice = _newTokenPrice;
        emit SetNewTokenPriceByOwenr(_msgSender(), _newTokenPrice);
    }

    function mint() public payable {
        if (userSftChecker(msg.sender)) revert SFT__YouAlreadyHaveSFT();
        if (msg.value != _tokenPrice) revert SFT__IncorrectValueSentForMinting();

        ERC3525._mint(msg.sender, _slot, _tokenValue);
        storeUserAddress();
        idGenerator();
        emit SftMintByUser(msg.sender, getTokenId(), _tokenValue, msg.value);
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

        return sftIdValidation(userTokenId);
    }

    // make a require on it
    function sftIdValidation(uint userTokenId) public pure returns (bool) {
        if (userTokenId != 0) {
            return true;
        } else {
            return false;
        }
    }

    function setSftPriceByHolder(uint _tokenId, uint newPrice) public {
        uint tokenId = ERC3525.balanceOf(msg.sender);
        if (tokenId != _tokenId) revert SFT__CallerIsNotTheOwner();

        updateSftPriceByHolder(tokenId, newPrice);
        emit SftNewPriceByHolder(msg.sender, newPrice, _tokenId);
    }

    function updateSftPriceByHolder(uint _tokenId, uint newPrice) public {
        userSftPrice[_tokenId] = newPrice;
    }

    /* getter functions */
    // getSftIdByUserAddress
    function getUserSftId(address userAddress) public view returns (uint tokenId) {
        return userAddressToSftId[userAddress];
    }

    function getTokenId() public view returns (uint id) {
        return _tokenID;
    }

    function getHolderSftPrice(uint _tokenId) public view returns (uint) {
        return userSftPrice[_tokenId];
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {
        mint();
    }

    fallback() external payable {
        mint();
    }
}
