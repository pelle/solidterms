import "Ricardian.sol";
// A simple abstract way of handling change for a Ricardian contract
// In this case only the offerer can propose changes to the contract.
// Implementing contracts can override this with the `canProposeChange()` function.
//
// - The party making the change calls `proposeChange` with the new ipfs hash of the terms
// - A TermsChanged event is created

contract Changeable is Ricardian {
  event TermsChanged(
      address indexed changer,
      bytes32 indexed terms
  );

  function canProposeChange() constant returns(bool) {
    return (msg.sender == offerer );
  }

  function proposeChange(bytes32 _terms) {
    if (!canProposeChange()) throw;
    super.changeContract(_terms);
    TermsChanged(offerer, terms);
  }
}
