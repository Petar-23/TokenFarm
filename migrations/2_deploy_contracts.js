// this file will put new smart contracts onto the blockchain

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy DApp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()
  
  // Transfer all Dapp Tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer('0xd8e06812f75Ad364232847A5b0Efd5c53bD76EE2', '1000000000000000000000000')  
}