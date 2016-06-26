import "Acceptable.sol";
import "Changeable.sol";

// A simple TermsOfService contract implenting explicit acceptance and change management.
// This can be deployed on it's own as a terms of service implementation for an external service.
// It could also be extended by any other SmartContract and used as a Ricardian TermsOfService for a Token or DAO.
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
// The offerer can change the agreement using the same `proposeChange` function
// 
// To force parties to accept the new agreement, a modifier `hasAcceptedLatest` can be used on functions

contract TermsOfService is Acceptable, Changeable {
  function TermsOfService(bytes32 _terms) {
    proposeChange(_terms);
  }
  function proposeChange(bytes32 _terms) {
    super.proposeChange(_terms);
    accept(_terms);
  }
}
