pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

// Start of smart contract
contract TokenFarm {
	// all code goes here...	
	// This is a public state variable of the type string and will be stored on the blockchain
	// public modifier lets us access this var from outside 
	string public name = "DApp Token Farm";
	address public owner;
	DappToken public dappToken;
	DaiToken public daiToken;

	address[] public stakers; //addresses that staked 
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

	constructor(DappToken _dappToken, DaiToken _daiToken) public {
		dappToken = _dappToken;
		daiToken = _daiToken;
		owner = msg.sender;
	}

	// 1. Stake Tokens (Deposit)
	function stakeTokens(uint _amount) public {
		//code goes here...

		// Require amount greater than 0
		require(_amount > 0, "amount cannot be 0");

		// Transfer Mock Dai tokens to this contract for staking
		daiToken.transferFrom(msg.sender, address(this), _amount);

		// Update staking balance
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount; 

		// Add user to stakers array only if they haven't staked already
		if(!hasStaked[msg.sender]) {
			stakers.push(msg.sender);
		}

		// Update staking status
		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}


	// 2. Issuing Tokens
	function issueTokens() public {
		// only owner can call the function
		require(msg.sender == owner, "caller must be the owner");
		// loop through the array of all ppl who staked and issue them tokens
		for (uint i=0; i<stakers.length; i++) {
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];
			if(balance > 0) {
				dappToken.transfer(recipient, balance);
			}
		}
	}

	// 3. Unstaking tokens (Withdraw)
	function unstakeTokens() public {
		//Fetch staking balance
		uint balance = stakingBalance[msg.sender];

		// require amount greater than 0
		require(balance > 0, "staking balance cannot be 0");

		// Transfer mDAI tokens to this contract for staking
		daiToken.transfer(msg.sender, balance);

		// Reset the staking balance
		stakingBalance[msg.sender] = 0;

		// Remove from Staking list
		isStaking[msg.sender] = false;

	}

}
