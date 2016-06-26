contract('RicardoCoin', function(accounts) {
  it("should be active", function(done) {
    var ricardo = RicardoCoin.deployed();
    ricardo.isActive.call().then(function(active) {
      assert.equal(active.valueOf(), true, "it should be active");
    }).then(done).catch(done);
  });

  it("should not be accepted", function(done) {
    var ricardo = RicardoCoin.deployed();
    ricardo.accepted.call(accounts[1]).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), 0, "it should not be accepted");
    }).then(done).catch(done);
  });

  it("should accept correct hash", function(done) {
    var ricardo = RicardoCoin.deployed();
    ricardo.terms.call().then(function (hash){
      assert.equal(hash,'0x28678b42f7fcf403009f1805e4e1233163b231b24d2b22105f3ea3686403193f');
      return ricardo.accept(hash,{from: accounts[5]});
    }).then(function() {
      return ricardo.accepted.call(accounts[5])
    }).then(function(timestamp) {
      assert.isAbove(timestamp.toNumber(), 0, "it should be accepted");
    }).then(done).catch(done);
  });

  it("should not accept incorrect hash", function(done) {
    var ricardo = RicardoCoin.deployed();
    ricardo.accept('0x8faeaecef87969a5e4677d09f8491c139b6e46db8d38ec02ef2de552d1d21e0a',{from: accounts[6]}).catch(function(e) {
      assert.instanceOf(e,Error,"It should throw an error");
    }).then(function() {
      return ricardo.accepted.call(accounts[6])
    }).then(function(timestamp) {
      assert.equal(timestamp.toNumber(), 0, "it should not be accepted");
    }).then(done).catch(done);
  });

  it("should send coin correctly for issuer", function(done) {
    var ricardo = RicardoCoin.deployed();

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];
    var account_three = accounts[2];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var amount = 10;

    ricardo.getBalance.call(account_one).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return ricardo.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return ricardo.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return ricardo.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return ricardo.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    }).then(done).catch(done);
  });

  it("account holders can not send if they have not accepted", function(done) {
    var ricardo = RicardoCoin.deployed();

    // Get initial balances of first and second account.
    var issuer = accounts[0];
    var holder = accounts[1];
    var receiver = accounts[2];

    var holder_balance;
    var receiver_balance;
    var amount = 10;

    ricardo.sendCoin(holder, amount, {from: issuer}).then(function() {
      return ricardo.getBalance.call(holder);
    }).then(function(balance) {
      holder_balance = balance.toNumber();
      return ricardo.getBalance.call(receiver);
    }).then(function(balance) {
      receiver_balance = balance.toNumber();
      return ricardo.sendCoin(receiver, amount, {from: holder});
    }).then(function() {
      return ricardo.getBalance.call(holder);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), holder_balance, "Amount was transfered by holder without holder having accepted terms");
      return ricardo.getBalance.call(receiver);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), receiver_balance, "Amount was transfered to receiver without holder having accepted terms");
    }).then(done).catch(done);
  });

  it("account holders can send if they have accepted", function(done) {
    var ricardo = RicardoCoin.deployed();

    // Get initial balances of first and second account.
    var issuer = accounts[0];
    var holder = accounts[3];
    var receiver = accounts[2];

    var holder_balance;
    var receiver_balance;
    var amount = 10;

    ricardo.sendCoin(holder, amount, {from: issuer}).then(function() {
      return ricardo.getBalance.call(holder);
    }).then(function(balance) {
      holder_balance = balance.toNumber();
      return ricardo.getBalance.call(receiver);
    }).then(function(balance) {
      receiver_balance = balance.toNumber();
      return ricardo.terms.call();
    }).then(function(terms) {
      return ricardo.accept(terms, {from: holder})
    }).then(function() {
      return ricardo.sendCoin(receiver, amount, {from: holder});
    }).then(function() {
      return ricardo.getBalance.call(holder);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), holder_balance - amount, "Amount was not transfered by holder even though holder having accepted terms");
      return ricardo.getBalance.call(receiver);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), receiver_balance + amount, "Amount was not transfered to receiver even though holder having accepted terms");
    }).then(done).catch(done);
  });


});
