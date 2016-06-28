import 'HasTerms.sol';

contract Retractable is HasTerms {
  // If agreement is not active the offerer can kill it
  function retract() 
    notActive
    onlyOfferer
    public {
      suicide(msg.sender);
    }
}