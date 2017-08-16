let chai = require('chai')
let expect = chai.expect
let SecurityDeposit = artifacts.require('SecurityDeposit')
let Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

console.log('web3 connected ->', web3.isConnected())

contract('SecurityDeposit', function (accounts) {

  before(function (done) {
    let sd = SecurityDeposit.deployed()
    sd.then(function (value) {
      instance = value
    }).then(() => {
      instance.setBeneficiary(accounts[1], {from: accounts[0], gas: 400000})
      done()
    })
  })

  it('Trustor can send funds', function (done) {
    instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
      assert.equal(web3.eth.getBalance(instance.address).valueOf(), 100,
        'deposit failed')
      done()
    })
  })
  it('Beneficiary can withdraw funds', function (done) {
    instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
      return instance.withdraw(50, 'broken window',
        {from: accounts[1], gas: 400000})
    }).then(function () {
      assert.equal(web3.eth.getBalance(instance.address).valueOf(), 150,
        'withdrawl failed')
      done()
    })
  })
  it('Trustor cannot withdraw funds', function (done) {
    instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
      return instance.withdraw(50, 'broken window',
        {from: accounts[0], gas: 400000})

    }).then(function () {
      throw 'Previous function should have thrown an error'
    }).catch(function (err) {
      expect(err.message).to.have.string('invalid opcode')
      done()

    })
  })
  it('Trustor cannot set beneficiary twice', function (done) {
    instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
      return instance.beneficiary.call()
    }).then(function (beneficiary) {
      assert.equal(beneficiary, accounts[1])
      done()
    })
  })
  it('Trustor cannot close contract ad hoc', function (done) {
    instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
      return instance.returnDeposit({from: accounts[0], gas: 400000})
    }).then(function () {
      throw 'Previous function should have thrown an error'
    }).catch(function (err) {
      expect(err.message).to.have.string('invalid opcode')
      done()

    })
  })
  it('Beneficiary can close contract and return remaining funds',
    function (done) {
      instance.sendFunds({value: 100, from: accounts[0]}).then(function () {
        return instance.returnDeposit({from: accounts[1], gas: 400000})
      }).then(function () {
        assert.equal(web3.eth.getBalance(instance.address).valueOf(), 0,
          'return failed')
        done()
      })
    })

})
