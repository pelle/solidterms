import "TermsOfService.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract RicardoCoin is TermsOfService {
	mapping (address => uint) balances;
	address issuer;
	
	function RicardoCoin()  
		TermsOfService(0x28678b42f7fcf403009f1805e4e1233163b231b24d2b22105f3ea3686403193f, msg.sender) {
		issuer = msg.sender;
		balances[msg.sender] = 10000;
	}

	function sendCoin(address receiver, uint amount) hasAcceptedLatest returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		return true;
	}

	function faucet() hasAccepted {
		balances[issuer] -= 100;
		balances[msg.sender] += 100;
	}

  	function getBalance(address addr) returns(uint) {
    	return balances[addr];
  	}
}
