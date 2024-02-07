// const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")
const { ethers, deployments } = require("hardhat")

describe("SFT Contract", () => {
    let contract
    let owner, user1, user2, user3, user4

    const ercName = "alireza"
    const ercSymbol = "AZK"
    const DECIMAL = 18

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        user4 = accounts[4]

        // SFT contract
        const SFTContract = await ethers.getContractFactory("SFT")
        contract = await SFTContract.deploy(owner.address, ercName, ercSymbol, DECIMAL) // msg.sender is deployer in solidity code
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
            const expectedPriceBeforeChange = 10

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
        it("the correct value for minting must be pass", async () => {
            const currentValue = 10
            await contract.mint({ value: currentValue })
        })
        it("the value for minting is lesser than specified price", async () => {
            const lesserTokenMintPrice = 2
            await expect(contract.connect(user1).mint({ value: lesserTokenMintPrice })).to.be
                .reverted
        })
        it("the value for minting is more than specified price", async () => {
            const extraTokenMintPrice = 12
            await expect(contract.connect(user1).mint({ value: extraTokenMintPrice })).to.be
                .reverted
        })
        it("the total supply must increase", async () => {
            const currentValue = 10
            await contract.mint({ value: currentValue })

            const expectedTotalSupply = 1
            const totalSupply = await contract.totalSupply()

            expect(totalSupply).to.equal(expectedTotalSupply)
        })
        it("must revert if User already have a SFT", async () => {
            const currentValue = 10
            await contract.connect(user1).mint({ value: currentValue })

            expect(contract.connect(user1).mint({ value: currentValue })).to.be.reverted
        })
    })
    describe("storing the address of users that bought SFT(storeUserAddress)", async () => {
        it("we need ensure store the sft id into our mapping", async () => {
            // first we need to mint and use this function
            const currentValue = 10
            await contract.connect(user2).mint({ value: currentValue })

            const expectedUserId = 1
            const mappingUserId = await contract.userAddressToSftId(user2.address)

            expect(expectedUserId).to.equal(mappingUserId)
        })
    })

    describe("generate ID for next User SFT(idGenerator)", async () => {
        it("new ID must be generate while calling this function", async () => {
            const expectedNewTokenId = 2
            await contract.idGenerator()
            const newTokenId = await contract.getTokenId()

            expect(newTokenId).to.equal(expectedNewTokenId)
        })
    })

    describe("getting Last Sft Token Id(getTokenId)", async () => {
        it("return token ID by calling this function", async () => {
            const currentValue = 10
            await contract.mint({ value: currentValue })

            const expectedCurrentTokenId = 2
            const currentTokenId = await contract.getTokenId()

            expect(currentTokenId).to.equal(expectedCurrentTokenId)
        })
    })

    describe("check User Having Sft for validation(userSftChecker)", async () => {
        it("function must return true if user has SFT", async () => {
            const currentValue = 10
            await contract.connect(user2).mint({ value: currentValue })

            const expectedValidation = true
            const realValidation = await contract.connect(user2).userSftChecker(user2.address)

            expect(expectedValidation).to.equal(realValidation)
        })
        it("function must return false if user hasn't SFT", async () => {
            const currentValue = 10
            await contract.connect(user3).mint({ value: currentValue })

            const expectedValidation = false
            const realValidation = await contract.connect(user2).userSftChecker(user2.address)

            expect(expectedValidation).to.equal(realValidation)
        })
    })

    describe("getting Sft Token Id With User Address(getUserSftId)", async () => {
        it("function must return user SFT ID with his/her address", async () => {
            const currentValue = 10
            await contract.connect(user2).mint({ value: currentValue })

            const expectedUserSftId = 1
            const userSFTId = await contract.getSftIdByUserAddress(user2.address)

            expect(userSFTId).to.equal(expectedUserSftId)
        })
    })

    describe("check The User Have Token Id in our Smart Contract(sftIdValidation)", async () => {
        it("function must return true if token id isn't zero", async () => {
            const currentValue = 10
            await contract.connect(user2).mint({ value: currentValue })

            const expectedValidation = true
            const realValidation = await contract.sftIdValidation(user2.address)

            expect(realValidation).to.equal(expectedValidation)
        })
        it("function must return false if token id is zero", async () => {
            const tokenIdWithoutMint = 0
            const expectedValidation = false
            const realValidation = await contract.sftIdValidation(tokenIdWithoutMint)
            expect(realValidation).to.equal(expectedValidation)
        })
    })

    describe("set new pirce On Owned SFT(setSftPriceByHolder)", async () => {
        it("set the price without minting", async () => {
            const tokenId = 4
            const newPrice = 15
            await expect(contract.setSftPriceByHolder(tokenId, newPrice)).to.be.reverted
        })
        it("must revert with invalid token ID", async () => {
            const currentValue = 10
            await contract.connect(user1).mint({ value: currentValue })

            const invalidTokenId = 4
            const newPrice = 15

            await expect(contract.setSftPriceByHolder(invalidTokenId, newPrice)).to.be.reverted
        })
        it("must pass with valid token ID", async () => {
            // current price
            const currentValue = 10
            await contract.connect(user1).mint({ value: currentValue })

            const validTokenId = 1
            const newPrice = 15

            expect(contract.connect(user1).setSftPriceByHolder(validTokenId, newPrice))
        })
    })

    describe("Update New Price On SFT By User(updateSftPriceByHolder)", async () => {
        it("price must change with calling this function", async () => {
            const currentValue = 10
            const tokenId = 1
            const newPrice = 45
            await contract.connect(user2).mint({ value: currentValue })

            await contract.updateSftPriceByHolder(tokenId, newPrice)

            const changedNewPrice = await contract.userSftPrice(tokenId)

            expect(changedNewPrice).to.equal(newPrice)
        })
    })

    describe("get The Price That User Set On his/her SFT(getHolderSftPrice)", async () => {
        it("function must return holder price by calling this function", async () => {
            const currentValue = 10
            const tokenId = 1
            const newPrice = 45
            await contract.connect(user2).mint({ value: currentValue })
            await contract.updateSftPriceByHolder(tokenId, newPrice)

            const expectedUserSftPrice = await contract.getHolderSftPrice(tokenId)

            expect(newPrice).to.equal(expectedUserSftPrice)
        })
    })

    describe("get Contract Balance After Users Minting(getContractBalance)", async () => {
        it("function must return contract balance", async () => {
            const newTokenPrice = 2
            await contract.connect(owner).setNewTokenPrice(newTokenPrice)

            await contract.connect(user1).mint({ value: 2 })
        })
    })
    describe("(Events) test events after calling functions", async () => {
        it("test (SetNewTokenPriceByOwenr) event", async () => {
            const tokenPrice = 15
            expect(await contract.setNewTokenPrice(tokenPrice)).to.emit(
                contract,
                "SetNewTokenPriceByOwenr"
            )
        })

        it("test (SftMintByUser) event", async () => {
            const currentValue = 10
            expect(await contract.mint({ value: currentValue })).to.emit(contract, "SftMintByUser")
        })
        it("test (SftNewPriceByHolder) event", async () => {
            const currentValue = 10
            const newTokenPrice = 15
            const validTokenId = 1

            await contract.mint({ value: currentValue })

            expect(await contract.setSftPriceByHolder(validTokenId, newTokenPrice)).to.emit(
                contract,
                "SftNewPriceByHolder"
            )
        })
    })
})
// describe for user address saver
// describe and think on id generator
// describe and think on userSftChecker
// })
