// A simple abstract contract for implementing Ricardian contracts as part of a SmartContract
//
// In this case there is a an offerer, which is initially the address creating the contract.
//
// - The offerer creates a contract like a terms of service and uploads it to IPFS.
// - The resulting ipfs hash is added to the contract using the `changeContract` function
// - At this point the contract is considered active

contract Ricardian {
  bytes32 public terms;
  uint public lastChange;
  address public offerer;

  function Ricardian() {
    offerer = msg.sender;
  }

  function isActive() public returns(bool) { return (lastChange > 0 && terms.length > 0) ;}
  modifier ifActive() { if (isActive()) _ } 

  // Basic implementation to be called in implementing contracts constructor or elsewhere with ipfs terms
  function changeContract(bytes32 _terms) internal {
    terms = _terms;
    lastChange = block.timestamp;
  }
 
}
