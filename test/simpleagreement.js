contract('AgreementFactory', function(accounts) {
  var hash = '0x8faeaecef87969a5e4677d09f8491c139b6e46db8d38ec02ef2de552d1d21e0a';
  var offerer = accounts[1];
  var invitee = accounts[2];
  var nonparty = accounts[3];
  var agreement;

  function createAgreement() {
    var factory = AgreementFactory.deployed();
    var event = factory.AgreementCreated({creator:offerer});
    return new Promise( function(accept, reject) {
      factory.createSimpleAgreement(hash,invitee, {from: offerer}).catch(reject);
      event.watch(function(error, result) { 
        if (error) {
          reject(error);
        } else {
          accept(SimpleAgreement.at(result.args.agreement));
        }
      });
    });
  }

  it("should have an offerer", function(done) {
    createAgreement().then(function(agreement) {
      return agreement.offerer.call()
    }).then(function(address) {
      assert.equal(address,offerer, "it should have correct offerer");
    }).then(done).catch(done);
  });

  it("should not be active", function(done) {
    createAgreement().then(function(agreement) {
      return agreement.isActive.call()
    }).then(function(active) {
      assert.equal(active.valueOf(), false, "it should not be active");
    }).then(done).catch(done);
  });

  it("should have lastChanged", function(done) {
    createAgreement().then(function(agreement) {
      return agreement.lastChange.call();
    }).then(function(changedAt) {
      assert.notEqual(changedAt.toNumber(), 0, "it have a lastChange date");
    }).then(done).catch(done);
  });

  it("should have terms", function(done) {
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.terms.call();
    }).then(function(terms) {
      assert.equal(terms, hash, "it should have correct hash set");
    }).then(done).catch(done);
  });

  it("should be accepted by offerer", function(done) {
    var lastChange;
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.lastChange.call();
    }).then(function(changedAt) {
      lastChange = changedAt.toNumber();
      return agreement.accepted.call(offerer)
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), lastChange, "it should be accepted");
      return agreement.acceptedCurrent.call();
    }).then(function(acceptedCurrent) {
      assert.equal(acceptedCurrent.toNumber(), 1, "it should count 1 accepted");
    }).then(done).catch(done);
  });

  it("should not be accepted by invitee", function(done) {
    createAgreement().then(function(agreement) {
      return agreement.accepted.call(invitee);
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), 0, "it should not be accepted");
    }).then(done).catch(done);
  });

  it("should have offerer as invited", function(done) {
    var lastChange;
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.lastChange.call();
    }).then(function(changedAt) {
      lastChange = changedAt.toNumber();
      return agreement.invited.call(offerer)
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), lastChange, "it should be accepted");
      return agreement.parties.call(0);
    }).then(function(party){
      assert.equal(party,offerer, "it should have offerer listed as a party");
    }).then(done).catch(done);
  });

  it("should have invitee as invited", function(done) {
    var lastChange;
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.lastChange.call();
    }).then(function(changedAt) {
      lastChange = changedAt.toNumber();
      return agreement.invited.call(invitee)
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), lastChange, "it should be have invited timestamp");
      return agreement.parties.call(1);
    }).then(function(party){
      assert.equal(party, invitee, "it should have invitee listed as a party");
    }).then(done).catch(done);
  });

  it("should not accept incorrect hash", function(done) {
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.accept('0x9faeaecef87969a5e4677d09f8491c139b6e46db8d38ec02ef2de552d1d21e0a',{from: invitee});
    }).catch(function(e) {
      assert.instanceOf(e,Error,"It should throw an error");
    }).then(function() {
      return agreement.accepted.call(invitee)
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), 0, "it should not be accepted");
    }).then(done).catch(done);
  });

  it("should not accept nonparty", function(done) {
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.accept(hash,{from: nonparty});
    }).catch(function(e) {
      assert.instanceOf(e,Error,"It should throw an error");
    }).then(function() {
      return agreement.accepted.call(nonparty)
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), 0, "it should not be accepted");
    }).then(done).catch(done);
  });

  it("invitee should accept correct hash", function(done) {
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      return agreement.accept(hash,{from: invitee});
    }).then(function() {
      return agreement.accepted.call(invitee)
    }).then(function(timestamp) {
      assert.isAbove(timestamp.toNumber(), 0, "it should be accepted");
      return agreement.acceptedCurrent.call();
    }).then(function(acceptedCurrent) {
      assert.equal(acceptedCurrent.toNumber(), 2, "it should count 2 accepted");
      return agreement.isActive.call();
    }).then(function(active) {
      assert.equal(active.valueOf(), true, "it should be active");
    }).then(done).catch(done);
  });

  it("allows offerer to proposeChange hash before being active", function(done) {
    var newTerms = '0xac6c8581751c30fbdd134173b4a40b55f2cc3c3e903c0690dc02810a12789f8d';
    var originalChange;
    var lastChange;
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      originalTerms = hash;
      return agreement.lastChange.call();
    }).then(function(changed) {
      originalChange = changed.toNumber();
      return agreement.proposeChange(newTerms, {from:offerer})
    }).then(function() {
      return agreement.terms.call()
    }).then(function (newHash){
      assert.equal(newHash, newTerms, "should set new terms");
      return agreement.lastChange.call();
    }).then(function(changed) {
      lastChange = changed.toNumber();
      assert.notEqual(lastChange, originalChange, "should update lastChange");
      return agreement.accepted.call(offerer);
    }).then(function(accepted) {
      assert.equal(accepted.toNumber(),lastChange, "offerer accepts agreement when changing");
    }).then(done).catch(done);
  });

  it("should allow invitee to proposeChange hash", function(done) {
    var newTerms = '0xac6c8581751c30fbdd134173b4a40b55f2cc3c3e903c0690dc02810a12789f8c';
    var originalChange;
    var lastChange;
    createAgreement().then(function(_agreement) {
      agreement = _agreement;
      originalTerms = hash;
      return agreement.lastChange.call();
    }).then(function(changed) {
      originalChange = changed.toNumber();
      return agreement.proposeChange(newTerms, {from:invitee})
    }).then(function() {
      return agreement.terms.call()
    }).then(function (newHash){
      assert.equal(newHash, newTerms, "should set new terms");
      return agreement.lastChange.call();
    }).then(function(changed) {
      lastChange = changed.toNumber();
      assert.notEqual(lastChange, originalChange, "should update lastChange");
      return agreement.accepted.call(offerer);
    }).then(function(accepted) {
      assert.equal(accepted.toNumber(),originalChange, "offerer only accepted original agreement");
      return agreement.accepted.call(invitee);
    }).then(function(accepted) {
      assert.equal(accepted.toNumber(),lastChange, "invitee accepts agreement when changing");
      return agreement.isActive.call();
    }).then(function(active) {
      assert.equal(active.valueOf(), false, "it should not be active");
      return agreement.isActive.call();
    }).then(function(active) {
      assert.equal(active.valueOf(), false, "it should not be active");
      return agreement.acceptedCurrent.call();
    }).then(function(acceptedCurrent) {
      assert.equal(acceptedCurrent.toNumber(), 1, "it should count 1 accepted");
      return agreement.accept(newTerms,{from: offerer});
    }).then(function() {
      return agreement.accepted.call(offerer)
    }).then(function(timestamp) {
      assert.isAbove(timestamp.toNumber(), lastChange, "it should be accepted");
      return agreement.isActive.call();
    }).then(function(active) {
      assert.equal(active.valueOf(), true, "it should be active");
    }).then(done).catch(done);
  });

  // it("does not allow offerer to proposeChange when active", function(done) {
  //   var newTerms = '0xac6c8581751c30fbdd134173b4a40b55f2cc3c3e903c0690dc02810a12789f8c';
  //   var originalChange;
  //   createAgreement().then(function(_agreement) {
  //     agreement = _agreement;
  //     originalTerms = hash;
  //     return agreement.lastChange.call();
  //   }).then(function(changed) {
  //     originalChange = changed.toNumber();
  //     return agreement.proposeChange(newTerms, {from:invitee})
  //   }).then(function() {
  //     return agreement.terms.call()
  //   }).then(function (hash){
  //     assert.notEqual(hash, newTerms, "should not set terms");
  //     return agreement.lastChange.call();
  //   }).then(function(changed) {
  //     assert.equal(changed.toNumber(), originalChange, "should not update lastChange");
  //   }).then(done).catch(done);
  // });


});
