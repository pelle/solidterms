import "HasTerms.sol";
// A simple abstract way of handling change for a Ricardian contract
// In this case only the offerer can propose changes to the contract.
// Implementing contracts can override this with the `canProposeChange()` function.
//
// - The party making the change calls `proposeChange` with the new ipfs hash of the terms
// - A TermsChanged event is created

contract Changeable is HasTerms {

  modifier changeProposable() { if (canProposeChange()) _ }

  function canProposeChange() constant returns(bool) {
    return (msg.sender == offerer );
  }

  function proposeChange(bytes32 _terms)
    changeProposable  
    changedTerms(_terms) {
    changeTerms(_terms);
    TermsChanged(msg.sender, terms);
  }
}
