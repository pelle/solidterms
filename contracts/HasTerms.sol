// A simple abstract contract for implementing Ricardian contracts as part of a SmartContract
//
// In this case there is a an offerer, which is initially the address creating the contract.
//
// - The offerer creates a contract like a terms of service and uploads it to IPFS.
// - The resulting ipfs hash is added to the contract using the `changeTerms` function
// - At this point the contract is considered active

contract HasTerms {
  // Event created when agreement is reached (active)
  event AgreementReached (
    address indexed agreement,
    bytes32 terms
  );
  // Event to be created when terms are accepted by a single party
  event TermsAccepted(
      address indexed accepter,
      bytes32 indexed terms
  );
  // Event to be created if Terms are changed
  event TermsChanged(
      address indexed changer,
      bytes32 indexed terms
  );

  bytes32 public terms;
  uint public lastChange;
  address public offerer;

  modifier ifActive() { if (isActive()) _ }
  modifier notActive() { if (!isActive()) _ }
  modifier onlyOfferer() { if (msg.sender == offerer) _ } 
  modifier matchesTerms(bytes32 _terms) { if (_terms == terms) _ }
  modifier changedTerms(bytes32 _terms) { if (_terms != terms) _ }

  // Implement functionality here specific to type of contract
  function isActive() constant returns(bool) { return false;}

  // Override this and call super in sub classes. 
  // It should probably be called in the final Contract's constructor
  function setOfferer(address _offerer) internal {
    offerer = _offerer;
  }

  // Basic implementation to be called in implementing contracts constructor or elsewhere with ipfs terms
  function changeTerms(bytes32 _terms) internal {
    terms = _terms;
    lastChange = block.timestamp;
  }

}
