const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
	.use(require('chai-as-promised'))
	.should()

// Function to convert tokens to wei
function tokens(n) {
	return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
	let daiToken, dappToken, tokenFarm

	before(async () => {
		// Load Contracts
		daiToken = await DaiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

		// Transfer all Dapp toekns to farm (1million)
		await dappToken.transfer(tokenFarm.address, tokens('1000000'))
		
		// Transfer tokens to investor
		await daiToken.transfer(investor, tokens('100'), { from: owner })
	})
	
	//Write Tests here...
	describe('Mock DAI deployment', async () => {
		it('has a name', async() => {
			let daiToken = await DaiToken.new()
			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')
		})
	})

	describe('Dapp Token deployment', async () => {
		it('has a name', async() => {
			let dappToken = await DappToken.new()
			const name = await dappToken.name()
			assert.equal(name, 'DApp Token')
		})
	})

	describe('TokenFarm deployment', async () => {
		it('has a name', async() => {
			let dappToken = await DappToken.new()
			const name = await tokenFarm.name()
			assert.equal(name, 'DApp Token Farm')
		})

		it('contract has tokens', async () => {
			let balance = await dappToken.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('Farming tokens', async() => {

		it('rewards investors for staking mDai tokens', async () => {
			let result

			// Check investors balance before staking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor mDai wallet balance correct before staking')
		
			// Stake mDAI tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor })
			await tokenFarm.stakeTokens(tokens('100'), { from: investor})

			// Check staking result
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'), 'investor mDAI wallet balance correct after staking')
		
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'), 'Token Farm mDAI balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('100'), 'Investor staking balance is correct after staking')
		
			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true', 'Investor staking status correct after staking')
		
			// issue Tokens
			await tokenFarm.issueTokens({ from: owner })

			// check balances after issuance
			result = await dappToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor DApp token wallet balance correct after issuance')
		
			// Ensure that only owner can issue tokens
			await tokenFarm.issueTokens({ from:investor }).should.be.rejected;

			// Unstake the tokens
			await tokenFarm.unstakeTokens({ from:investor })

			// Check results after unstaking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'Investor mDAI wallet balance correct after staking')
		
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'), 'Token Farm mDAI balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'), 'Investor staking balance correct after staking')
		})
	})
})