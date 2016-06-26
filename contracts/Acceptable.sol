import "Ricardian.sol";
// A simple abstract way of handling acceptance for a Ricardian contract
//
// - Parties accept the contract by calling the `accept()` function providing the same ipfs hash
// - This is recorded as an acceptance of the contract by the msg.sender
// - The contract author can mark functions as hasAccepted, which means that they are only allowed to be used by parties who have accepted the agreement
// - An event `TermsAccepted` is emitted with the party's address and the current ipfs hash
// To force parties to accept the new agreement, a modifier `hasAcceptedLatest` can be used on functions

contract Acceptable is Ricardian {
  event TermsAccepted(
      address indexed accepter,
      bytes32 indexed terms
  );
  mapping(address => uint) public accepted;

  modifier hasAccepted() { if (accepted[msg.sender] > 0) _ } 
  modifier hasAcceptedLatest() { if (accepted[msg.sender] >= lastChange) _ }

  // Party accepts contract by presenting the hash that they are accepting 
  function accept(bytes32 _terms) ifActive {
    if (_terms != terms) throw;
    accepted[msg.sender] = block.timestamp;    
    TermsAccepted(msg.sender, terms);
  }

}
