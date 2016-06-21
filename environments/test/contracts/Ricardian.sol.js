// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"isActive","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"accepted","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contractHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"_contractHash","type":"bytes32"}],"name":"changeContract","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"offerer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_contractHash","type":"bytes32"}],"name":"accept","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"lastChange","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"changer","type":"address"},{"indexed":false,"name":"contractHash","type":"bytes32"}],"name":"TermsChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"accepter","type":"address"},{"indexed":false,"name":"contractHash","type":"bytes32"}],"name":"TermsAccepted","type":"event"}],
    binary: "606060405260028054600160a060020a031916331790556101f4806100246000396000f3606060405236156100615760e060020a600035046322f3e2d481146100635780632b34af7014610081578063904c609414610099578063adac596f146100a2578063c782ff1f146100c5578063e4725ba1146100d7578063fab3f57b146100e6575b005b6100ef5b6000600060016000505411801561007c575060015b905090565b61010360043560036020526000908152604090205481565b61010360005481565b610061600435600254600160a060020a0390811633919091161461017b57610002565b610115600254600160a060020a031681565b6100616004355b61018d610067565b61010360015481565b604080519115158252519081900360200190f35b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b6002546000546040805191825251600160a060020a0392909216917f32b0c5670462a82ce3dbd83e35094061fb60556f43a7a05e7a18b6ee5bb97a549181900360200190a25b50565b600081905542600155610132816100de565b156101785760005481146101a057610002565b600160a060020a03331660008181526003602090815260408083204290559154825190815291517f8d0c8ab3f9077dc0f8465d197382d9be502ea72a21e747e89890684e21214b449281900390910190a25056",
    unlinked_binary: "606060405260028054600160a060020a031916331790556101f4806100246000396000f3606060405236156100615760e060020a600035046322f3e2d481146100635780632b34af7014610081578063904c609414610099578063adac596f146100a2578063c782ff1f146100c5578063e4725ba1146100d7578063fab3f57b146100e6575b005b6100ef5b6000600060016000505411801561007c575060015b905090565b61010360043560036020526000908152604090205481565b61010360005481565b610061600435600254600160a060020a0390811633919091161461017b57610002565b610115600254600160a060020a031681565b6100616004355b61018d610067565b61010360015481565b604080519115158252519081900360200190f35b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b6002546000546040805191825251600160a060020a0392909216917f32b0c5670462a82ce3dbd83e35094061fb60556f43a7a05e7a18b6ee5bb97a549181900360200190a25b50565b600081905542600155610132816100de565b156101785760005481146101a057610002565b600160a060020a03331660008181526003602090815260408083204290559154825190815291517f8d0c8ab3f9077dc0f8465d197382d9be502ea72a21e747e89890684e21214b449281900390910190a25056",
    address: "",
    generated_with: "2.0.9",
    contract_name: "Ricardian"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("Ricardian error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("Ricardian error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("Ricardian error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("Ricardian error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.Ricardian = Contract;
  }

})();
