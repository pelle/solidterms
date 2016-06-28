import "Invitable.sol";
// A simple abstract way of handling invitation of parties to a Ricardian contract
//
// - The offerer can invite a party to the agreement, which creates an Invitation event to a party
// - Any party invited is stored in the parties list as well as the invited mapping

contract InvitationOnly is Invitable {
  // Party accepts contract by presenting the hash that they are accepting 
  function accept(bytes32 _terms) isInvited {
    super.accept(_terms);
  }
}
