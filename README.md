# Security Deposit
This contract acts as a trustee. The trustor transfers the agreed-upon sum
to the contract for the benefit of the beneficiary. The design of the contract is guided
by the way a security deposit works that is set up by a renter (trustor) in favor of the 
landlord (beneficiary).

Rules:
- Only the trustor can transfer funds to the contract
- Only the trustor determines the beneficiary
- Once set, the beneficiary can not be changed
- Only the beneficiary can withdraw funds
- Upon termination, all funds are returned to the trustor
- Only the beneficiary can terminate the contract without waiting period
- The trustor can terminate the contract after a 30 day waiting period
- The beneficiary can object the termination requested by the trustor
- No interests are accumulated on the funds

## Getting started
The code was developed and tested with [truffle](https://github.com/trufflesuite/truffle). 
If you want to play around with the contract, I recommend installing truffle as well as
[testrpc](https://github.com/ethereumjs/testrpc).

## Deploy factory to testrpc

    testrpc
    truffle migrate --reset
    
## Run the tests

    truffle test

## Hands-on

It is very instructive to have a look at the tests in `/test`. The
tests show how to trigger the factory to create a new security deposit
and how to interact with the freshly created contract. Below I give
a shorter introduction on how create a contract 
via the truffle console.

Start the truffle console

    truffle console
    
Create a new security deposit contract

    SecurityDepositFactory.deployed().then((factory) => {return factory.newSecurityDeposit(web3.eth.accounts[0])})

The factory will return a transaction receipt similar to this one

    { tx: '0xfd9922d772f8b56f7d75a1eb12279197c7ce2a27028291ec01068f549d70363d',
    receipt:
       { transactionHash: '0xfd9922d772f8b56f7d75a1eb12279197c7ce2a27028291ec01068f549d70363d',
         transactionIndex: 0,
         blockHash: '0x9d4903aa09d9879feccbcf706756e034057ec35922462735f2e5e11e40780994',
         blockNumber: 34,
         gasUsed: 352813,
         cumulativeGasUsed: 352813,
         contractAddress: null,
         logs: [] },
    logs: [] }

Get an address of the newly created contract

    SecurityDepositFactory.deployed().then((factory) => {return factory.getContractAddressAtIndex(0)})
        
    '0x3b31f5d4cac76f757f5429359a52746e680b9a41'

Get an instance of the contract

    security_deposit = SecurityDeposit.at('0x3b31f5d4cac76f757f5429359a52746e680b9a41')

Set a beneficiary

    security_deposit.setBeneficiary(web3.eth.accounts[1])

Send funds

    security_deposit.sendFunds({value:100, from: web3.eth.accounts[0], gas: 400000 })

Check the balance

    web3.eth.getBalance('0x3b31f5d4cac76f757f5429359a52746e680b9a41')
    { [String: '100'] s: 1, e: 2, c: [ 100 ] }
