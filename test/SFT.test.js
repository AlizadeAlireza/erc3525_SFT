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
            const expectContractOwner = owner.address

            expect(getContractOwner).to.equal(expectContractOwner)
        })
        it("decimal accurancy", async () => {
            const getContractDecimal = await contract.valueDecimals()
            const expectedContractDecimal = 18

            expect(getContractDecimal).to.equal(expectedContractDecimal)
        })
        it("symbol accurancy", async () => {
            const getContractSymbol = await contract.symbol()
            const expectedContractSymbol = "AZK"

            expect(getContractSymbol).to.equal(expectedContractSymbol)
        })
        it("name accurancy", async () => {
            const getContractName = await contract.name()
            const expectedContractName = "alireza"

            expect(getContractName).to.equal(expectedContractName)
        })
    })
    describe("set new price of minting(setNewTokenPrice)", async () => {
        it("only owner can call this function and change the price", async () => {
            const newTokenPrice = 2
            await contract.connect(owner).setNewTokenPrice(newTokenPrice)
        })
        it("set new price after changing price with call this function", async () => {
            const tokenPriceBeforeChange = await contract._tokenPrice()
            const expectedPriceBeforeChange = 0

            const newTokenPrice = 2
            await contract.connect(owner).setNewTokenPrice(newTokenPrice)

            const tokenPriceAfterChange = await contract._tokenPrice()
            // expected token price after change is the newTokenPrice variable

            expect(tokenPriceBeforeChange).to.equal(expectedPriceBeforeChange)
            expect(tokenPriceAfterChange).to.equal(newTokenPrice)
        })
        it("not owner must get revert after call this function", async () => {
            const newTokenPrice = 2

            expect(contract.connect(user1).setNewTokenPrice(newTokenPrice)).to.be.reverted
        })
    })
})
