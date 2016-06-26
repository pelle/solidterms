// A simple abstract contract for implementing Ricardian contracts as part of a SmartContract
// In this case there is a an offerer, which is initially the address creating the contract.
//
// - The offerer creates a contract like a terms of service and uploads it to IPFS.
// - The resulting ipfs hash is added to the contract using the `changeContract` function
// - At this point the contract is considered active
// - Other parties can call the `accept()` function providing the same ipfs hash
// - This is recorded as an acceptance of the contract by the msg.sender
// - The contract author can mark functions as hasAccepted, which means that they are only allowed to be used by parties who have accepted the agreement
//
// Changing the contract
// 
// The offerer can change the agreement using the same `changeContract` function
// 
// To force parties to accept the new agreement, a modifier `hasAcceptedLatest` can be used on functions

contract Ricardian {
  event TermsChanged(
      address indexed changer,
      bytes32 indexed contractHash
  );
  event TermsAccepted(
      address indexed accepter,
      bytes32 indexed contractHash
  );

  bytes32 public terms;
  uint public lastChange;
  address public offerer;
  mapping(address => uint) public accepted;

  function Ricardian() {
    offerer = msg.sender;
  }

  function isActive() public returns(bool) { return (lastChange > 0 && terms.length > 0) ;}

  modifier ifActive() { if (isActive()) _ } 
  modifier hasAccepted() { if (accepted[msg.sender] > 0) _ } 
  modifier hasAcceptedLatest() { if (accepted[msg.sender] >= lastChange) _ }

  function accept(bytes32 _terms) ifActive {
    if (_terms != terms) throw;
    accepted[msg.sender] = block.timestamp;    
    TermsAccepted(msg.sender, terms);
  }

  function changeContract(bytes32 _terms) {
    if (msg.sender != offerer) throw;
    terms = _terms;
    lastChange = block.timestamp;
    TermsChanged(offerer, terms);
    accept(_terms);
  }
  
}
