// const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")
const { ethers, deployments } = require("hardhat")

describe("SFT Contract", () => {
    let contract
    let owner, user1, user2, user3, user4

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        user4 = accounts[4]

        // SFT contract
        const SFTContract = await ethers.getContractFactory("SFT")
        contract = await SFTContract.deploy() // msg.sender is deployer in solidity code
        await contract.waitForDeployment()
    })
    describe("constructor for after deploy contract", async () => {
        it("deployer is only owner", async () => {
            const getContractOwner = await contract.owner()
            console.log(getContractOwner)
            console.log(owner.address)

            const expectContractOwner = owner.address
            expect(getContractOwner).to.equal(expectContractOwner)
        })
        it("decimal accurancy", async () => {})
        it("symbol accurancy", async () => {})
        it("name accurancy", async () => {})
    })
})
