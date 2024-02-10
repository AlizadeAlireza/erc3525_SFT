// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface ISFT {
    function userSftChecker(address userAddress) external view returns (bool);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract Protocol {
    address public owner;
    uint256 commissionRate;
    ISFT immutable address_Id_SFT = ISFT(0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3); // address of SFT
    IERC20 public immutable token = IERC20(0xd9145CCE52D386f254917e481eB44e9943F39138); // address of KIP Token

    constructor() {
        owner = msg.sender;
        commissionRate = 10; // 10% comission
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Mapping from an address to Owner
    mapping(address => Info) public Owner;
    struct Info {
        uint256 balance;
        uint256 pricePerQuery;
    }
    // Transactions history store in the blockchain
    uint256 id = 0;
    mapping(uint256 => Transactions) public idTransactions;
    struct Transactions {
        address payer; // user who paid for answer
        address AppOwner;
        uint256 moneyPaidToAppOwner;
        address ModelOwner;
        uint256 moneyPaidToModelOwner;
        address DataOwner;
        uint256 moneyPaidToDataOwner;
    }

    function payment(
        uint256 moneyToDataOwner,
        uint256 moneyToAppOwner,
        uint256 moneyToModelOwner,
        address DataOwner,
        address AppOwner,
        address ModelOwner
    ) public {
        //check all requires
        require(address_Id_SFT.userSftChecker(DataOwner), "Data owner doesn`t have a SFT");
        require(address_Id_SFT.userSftChecker(AppOwner), "App owner doesn`t have a SFT");
        require(address_Id_SFT.userSftChecker(ModelOwner), "Model owner doesn`t have a SFT");
        uint256 totalPrice = moneyToDataOwner + moneyToAppOwner + moneyToModelOwner;
        require(token.balanceOf(msg.sender) >= totalPrice, "User doesn`t have enough money");

        //transfer
        require(token.transfer(address(this), totalPrice), "Some Problem with ERC20");
        Owner[DataOwner].balance += moneyToDataOwner;
        Owner[AppOwner].balance += moneyToAppOwner;
        Owner[ModelOwner].balance += moneyToModelOwner;
        //store in the blockchain
        id++;
        idTransactions[id] = Transactions({
            payer: msg.sender,
            AppOwner: AppOwner,
            moneyPaidToAppOwner: moneyToAppOwner,
            ModelOwner: ModelOwner,
            moneyPaidToModelOwner: moneyToModelOwner,
            DataOwner: DataOwner,
            moneyPaidToDataOwner: moneyToDataOwner
        });
    }

    function setPricePerQuery(uint256 amount) public {
        require(address_Id_SFT.userSftChecker(msg.sender), "You don`t have a SFT");
        Owner[msg.sender].pricePerQuery = amount;
    }

    function getPricePerQuery(address addressOwner) public view returns (uint256) {
        return Owner[addressOwner].pricePerQuery;
    }

    function getBalance() public view returns (uint256) {
        if (address_Id_SFT.userSftChecker(msg.sender)) {
            return Owner[msg.sender].balance;
        } else {
            return token.balanceOf(msg.sender);
        }
    }

    function setCommissionRate(uint256 newRate) public onlyOwner {
        require(newRate <= 100, "Commission rate must be <= 100%");
        commissionRate = newRate;
    }

    function withdraw(uint256 amount) public {
        require(amount <= token.balanceOf(address(this)), "Not enough money in the pool");
        require(amount <= Owner[msg.sender].balance, "You don`t have enough money for");
        require(address_Id_SFT.userSftChecker(msg.sender), "You don`t have a SFT");

        Owner[msg.sender].balance -= amount;
        uint256 netProfit = (amount * (100 - commissionRate)) / 100;
        token.approve(address(this), netProfit);
        token.transferFrom(address(this), msg.sender, netProfit);
    }
}
