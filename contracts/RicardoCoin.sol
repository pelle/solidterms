import "ConvertLib.sol";
import "Ricardian.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract RicardoCoin is Ricardian {
	mapping (address => uint) balances;

	function RicardoCoin() {
		balances[tx.origin] = 10000;
		// Contract at ipfs QmR4NbJgHZ4JA1Uexi6t6JpZENm7PdY9oqeQM2YVCsyB3c
		changeContract(0x28678b42f7fcf403009f1805e4e1233163b231b24d2b22105f3ea3686403193f);
	}

	function sendCoin(address receiver, uint amount) hasAccepted returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}
  	function getBalance(address addr) returns(uint) {
    	return balances[addr];
  	}
}
