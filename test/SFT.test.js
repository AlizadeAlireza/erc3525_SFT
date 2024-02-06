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

            await expect(contract.connect(user1).setNewTokenPrice(newTokenPrice)).to.be.reverted
        })
    })
    describe("mint the Sft by the user(mint)", async () => {
        it("the correct value for minting must be pass", async () => {})
        it("the value for minting is lesser than specified price", async () => {})
        it("the value for minting is more than specified price", async () => {})
        it("the total supply must increase", async () => {})
        it("we can test inside functions with it", async () => {})
    })
    describe("storing the address of users that bought SFT(storeUserAddress)", async () => {
        it("we need ensure store the sft id into our mapping", async () => {
            // first we need to mint and use this function
        })
    })

    describe("generate ID for next User SFT(idGenerator)", async () => {
        it("new ID must be generate while calling this function", async () => {})
    })

    describe("getting Last Sft Token Id(getTokenId)", async () => {
        it("return token ID by calling this function", async () => {})
    })

    describe("check User Having Sft for validation(userSftChecker)", async () => {
        it("function must return true if user has SFT", async () => {})
        it("function must return false if user hasn't SFT", async () => {})
    })

    describe("getting Sft Token Id With User Address(getUserSftId)", async () => {
        it("function must return user SFT ID with his/her address", async () => {})
    })

    describe("check The User Have Token Id in our Smart Contract(sftIdValidation)", async () => {})

    describe("set new pirce On Owned SFT(setSftPriceByHolder)", async () => {})

    describe("Update New Price On SFT By User(updateSftPriceByHolder)", async () => {})

    describe("get The Price That User Set On his/her SFT(getHolderSftPrice)", async () => {})

    describe("get Contract Balance After Users Minting(getContractBalance)", async () => {})
})
// describe for user address saver
// describe and think on id generator
// describe and think on userSftChecker
// })
// it("test for balance", async () => {
//     const newTokenPrice = 2
//     await contract.connect(owner).setNewTokenPrice(newTokenPrice)

//     // const value = ethers.utils.parseEther((PURCHASED_DONUTS * DONUT_PRICE).toString())
//     await contract.connect(user1).mint({ value: 2 })
//     console.log(await contract.balance())
// })
