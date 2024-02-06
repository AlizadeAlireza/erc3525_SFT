# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

This is a Solidity smart contract named "SFT" that implements the ERC3525 standard. It allows users to mint tokens by paying a specified price, store the address of users that bought SFT, set a new price for their SFT, and get the price that the user set on their SFT. The contract also includes functions to generate an ID for the next user SFT, check if a user has an SFT, and get the contract balance after users minting. The contract is written in Solidity version 0.8.0 and uses the OpenZeppelin and SolvProtocol libraries. The test cases are written in JavaScript using the Hardhat framework.
