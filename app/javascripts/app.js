var Buffer = Tools.Buffer.Buffer;
var bs58 = Tools.bs58;
var ipfs = Tools.ipfs;

var accounts;
var account;
var balance;
var terms;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var ricardo = RicardoCoin.deployed();

  ricardo.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

function sendCoin() {
  var ricardo = RicardoCoin.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;

  setStatus("Initiating transaction... (please wait)");

  ricardo.sendCoin(receiver, amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

function checkAcceptance() {
  var ricardo = RicardoCoin.deployed();
  console.log("checkAcceptance of "+ account);
  ricardo.accepted.call(account).then(function(value) {
    console.log("received value "+ value);
    var accepted_element = document.getElementById("accepted");
    if (value.valueOf() == 0) {
      document.getElementById("sendform").style="display:none";
      document.getElementById("accept-button").style="display:block";
      accepted_element.innerText="";
    } else {
      document.getElementById("accept-button").style="display:none";
      document.getElementById("sendform").style="display:block";
      accepted_element.innerText = "Accepted on : "+new Date(1000*value.valueOf());
    }
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting acceptance; see log.");
  });
};

function accept(e) {
  var ricardo = RicardoCoin.deployed();
  document.getElementById("accept-button").style="display:none";
  ricardo.accept(terms, {from: account}).then(function(value) {
    checkAcceptance();
    return ricardo.faucet({from:account})
  }).then(function(value) {
      setStatus("Called faucet");
      refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error performing acceptance; see log.");
  });
  return false;
};

window.onload = function() {
  var ricardo = RicardoCoin.deployed();
  ipfs.setProvider(ipfs.localProvider);
  ricardo.terms.call().then(function(hash) {
    terms = hash;
    var ipfshash = bs58.encode(new Buffer("1220" + hash.slice(2), 'hex'));
    document.getElementById('ipfshash').innerText = ipfshash;
    document.getElementById('plaintext').value = "loading ipfs hash " + ipfshash;
    ipfs.catText(ipfshash, function(e,r) {
      document.getElementById('plaintext').value = r;
    });    
  });

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    var options = ""
    for(i in accounts) {
      options += "<option value="+i+">"+accounts[i]+"</option>\n"
    }
    var accountselector = document.getElementById("accounts");
    accountselector.innerHTML = options
    accountselector.onchange = function(e) {
      account = accounts[e.currentTarget.selectedIndex];
      checkAcceptance();
      refreshBalance();
    }
    account = accounts[0];
    checkAcceptance();
    refreshBalance();
  });
}
