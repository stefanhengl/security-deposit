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

## Prerequisites
The code was developed and tested with [truffle](https://github.com/trufflesuite/truffle). 
If you want to play around with the contract, I recommend to install truffle as well as
[testrpc](https://github.com/ethereumjs/testrpc).

## Deploy to testrpc

    testrpc
    truffle migrate
    
## Run the tests

    truffle test

## Interact with deployed contract

Start the truffle console

    truffle console
    
Get the trustor

    SecurityDeposit.deployed()
        .then((instance) => {return instance.trustor.call()})
        .then((res) => {console.log(res)})

Set the beneficiary

    SecurityDeposit.deployed()
        .then((instance) => {instance.setBeneficiary(web3.eth.accounts[1])})
      
Transfer funds

    SecurityDeposit.deployed()
        .then((instance) => {instance.sendFunds({from: web3.eth.accounts[0], value: 100, gas: 400000})})
    
Check the balance

    SecurityDeposit.deployed()
        .then((instance) => {console.log(web3.eth.getBalance(instance.address))})

