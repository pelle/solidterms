import 'TermsOfService.sol';
import 'SimpleAgreement.sol';

contract AgreementFactory {
  event AgreementCreated(
    address indexed creator,
    address agreement
  );

  function createTermsOfService(bytes32 terms) public returns(bool) {
    TermsOfService agreement = new TermsOfService(terms, msg.sender);
    AgreementCreated(msg.sender,agreement);
  }

  function createSimpleAgreement(bytes32 terms, address invitee) public returns(bool) {
    SimpleAgreement agreement = new SimpleAgreement(terms, msg.sender, invitee);
    AgreementCreated(msg.sender,agreement);
  }

}