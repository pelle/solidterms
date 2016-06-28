import "Acceptable.sol";
// A simple abstract way of handling invitation of parties to a Ricardian contract
//
// - The offerer can invite a party to the agreement, which creates an Invitation event to a party
// - Any party invited is stored in the parties list as well as the invited mapping

contract Invitable is Acceptable {
  event Invitation(
      address indexed offerer,
      address indexed invitee,
      bytes32 indexed terms
  );
  address[] public parties;
  mapping(address => uint) public invited;

  modifier isInvited() { if (invited[msg.sender] > 0) _ } 
  modifier onlyInvitePermissions() { if (canInvite()) _ }
  modifier notYetInvited(address party) { if (invited[party] == 0) _ }

  function canInvite() constant returns(bool) {
    return (msg.sender == offerer );
  }
  
  // Call this to invite a new party
  function invite(address invitee) 
    onlyInvitePermissions
    notYetInvited(invitee)
    public returns(bool) {
      addParty(invitee);
      return true;
  }

  function addParty(address invitee) internal {
    parties.push(invitee);
    invited[invitee] = block.timestamp;
    Invitation(offerer, invitee, terms);
  }
}
