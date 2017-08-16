/* Security Deposit
This contract acts as a trustee. The trustor transfers the agreed-upon sum
to this contract for the benefit of the beneficiary. The contract is designed
based on the security deposit provided by a renter for the benefit of the landlord.

Rules:
- Only the trustor can transfer funds to the contract
- Only the trustor determines the beneficiary
- Once set, the beneficiary can not be changed
- Only the beneficiary can withdraw funds
- Upon termination, all funds are returned to the trustor
- Only the beneficiary can terminate the contract without waiting period
- The trustor can terminate the contract after a 30 day waiting period, if the beneficiary does not object
- No interests are accumulated on the funds
*/
pragma solidity ^0.4.13;


contract SecurityDeposit {

    address public trustor = msg.sender;
    address public beneficiary;

    uint private claimed_at;  // keep track of the trustor's claim to terminate the contract
    uint private flag = 0;
    uint private objection = 0;

    modifier onlyBy(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier onlyAfter(uint _time) {
        require(now >= _time);
        _;
    }

    event Withdrawal(address by, uint amount, string reason);
    event Claimed(address by, uint timestamp);

    function setBeneficiary(address new_beneficiary) onlyBy(trustor) {
        // The beneficiary can only be set once
        if (flag == 0) {
            beneficiary = new_beneficiary;
            flag = 1;
        }
    }

    function sendFunds() payable onlyBy(trustor) {
        // only the trustor can send funds
    }

    function withdraw(uint amount, string reason) onlyBy(beneficiary) {
        // only the beneficiary can withdraw funds. All withdrawals throw an event
        if (amount < this.balance) {
            msg.sender.transfer(amount);
            Withdrawal(msg.sender, amount, reason);  // throw an event, which the trustor can monitor
        }
    }

    function returnDeposit() onlyBy(beneficiary) {
        selfdestruct(trustor);
    }

    /*
    The following code makes sure that the trustor can cancel the contract in the case
    that the beneficiary lost access to the account. To withdraw all capital, the trustor
    has to call the contract's function "claim". Afterwards the beneficiary has 30 days
    time to object the claim. After 30 days, the trustor can call "terminate" and the
    contract self-destructs and all funds are transferred back to the trustor.
    */
    function claim() onlyBy(trustor) {
        claimed_at = now;
        objection = 0;
        Claimed(msg.sender, claimed_at);  // throw an event, which the beneficiary can monitor
    }

    function object() onlyBy(beneficiary) {
        objection = 1;
    }

    function terminate() onlyBy(trustor) onlyAfter(claimed_at + 30 days) {
        selfdestruct(trustor);
    }
}
