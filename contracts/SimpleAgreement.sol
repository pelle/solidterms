import 'InvitationOnly.sol';
import 'Changeable.sol';
import 'Retractable.sol';

// This is an example of creating a very simple negotiable 2 party agreement.
contract SimpleAgreement is InvitationOnly, Changeable, Retractable {
  uint public acceptedCurrent;

  function SimpleAgreement(bytes32 _terms, address offerer, address invitee) {
    setOfferer(offerer);
    changeTerms(_terms);
    addParty(offerer);
    addParty(invitee);
    accepted[offerer] = block.timestamp;
    acceptedCurrent = 1;
  }

  function isActive() constant returns(bool) { 
    return (acceptedCurrent == parties.length);
  }

  function canProposeChange() constant returns(bool) {
    return invited[msg.sender] != 0 && !isActive();
  }

  function proposeChange(bytes32 _terms) {
    super.proposeChange(_terms);
    acceptedCurrent = 0;    
    accept(_terms);
  }

  function accept(bytes32 _terms) {
    super.accept(_terms);
    acceptedCurrent ++;
    if (isActive()) AgreementReached(this,terms);
  }
}
