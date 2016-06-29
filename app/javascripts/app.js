var Buffer = Tools.Buffer.Buffer;
var bs58 = Tools.bs58;
var ipfs = Tools.ipfs;

var accounts;
var account;
var balance;
var terms;
var lastChange;

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
    if (value.valueOf() < lastChange) {
      document.getElementById("sendform").style="display:none";
      document.getElementById("accept-button").style="display:block";
      accepted_element.innerText="";
      if (value.valueOf() != 0 ) {
        setStatus("Terms of Service have changed, please accept the new terms")
      }
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

function isChangeable() {
  var ricardo = RicardoCoin.deployed();
  console.log("isChangeable for "+ account);
  ricardo.canProposeChange.call(account, {from: account}).then(function(value) {
    console.log("received value "+ value);
    var plaintext = document.getElementById("plaintext");
    if (value.valueOf() == true) {
      plaintext.disabled = false;
      document.getElementById('change-button').style="display:block";
    } else {
      document.getElementById('change-button').style="display:none";
      plaintext.disabled = true;
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

function proposeChange(e) {
  var ricardo = RicardoCoin.deployed();
  document.getElementById("change-button").style="display:none";
  ipfs.add(document.getElementById('plaintext').value, function(e,hash) {
    if (e) { 
      console.log(e);
      setStatus("error uploading to ipfs");
    } else {
      console.log("uploaded new terms to ipfs: " + hash);
      var hexHash = "0x" + new Buffer(bs58.decode(hash).slice(2)).toString('hex');
      console.log('hex hash: '+ hexHash);
      ricardo.proposeChange(hexHash, {from: account}).then(function(tx) {
          setStatus("Changed terms");
          document.getElementById("change-button").style="display:block";
          loadTerms().then(checkAcceptance);
      }).catch(function(e) {
        console.log(e);
        document.getElementById("change-button").style="display:block";
        setStatus("Error performing change; see log.");
      });
    }
  });
  return false;
};

function hex2base58(hash) {
  return bs58.encode(new Buffer("1220" + hash.slice(2), 'hex'))
}
function loadTerms() {
  var ricardo = RicardoCoin.deployed();
  return ricardo.terms.call().then(function(hash) {
    terms = hash;
    var ipfshash = hex2base58(hash);
    var ipfslink = document.getElementById('ipfshash')
    ipfslink.innerText = ipfshash;
    ipfslink.href = "https://ipfs.io/ipfs/" + ipfshash;
    document.getElementById('plaintext').value = "loading ipfs hash " + ipfshash;
    ipfs.catText(ipfshash, function(e,r) {
      document.getElementById('plaintext').value = r;
    });    
  }).then(function(){ 
    return ricardo.lastChange.call().then(function(timestamp) {
      console.log("last changed at: "+timestamp);
      lastChange = timestamp.valueOf();
      document.getElementById('last-changed').innerText = "Last Changed on : "+new Date(1000*lastChange);
    });
  });
}

function eventLogger(error,result) {
    var eventlog = document.getElementById("eventlog");
    var verb;
    var actor;
    if (result.event == "TermsChanged") {
      action = " changed the terms to ";
      actor = result.args.changer;
    } else if(result.event == "TermsAccepted") {
      action = " accepted the terms of "
      actor = result.args.accepter;
    }
    var msg;
    if (result.args && result.args.terms) {
      var ipfshash = hex2base58(result.args.terms);
      msg = actor + action+ "<a href='https://ipfs.io/ipfs/"+ipfshash+"'>"+ipfshash+"</a>";
    } else {
      // msg = result.event;
      console.log(result);
    }
    eventlog.insertAdjacentHTML("beforeBegin",  "<li>"+msg+"</li>");
}
function eventListener() {
  var ricardo = RicardoCoin.deployed();
  
  var events = ricardo.allEvents();
  events.watch(eventLogger);
  events.get(function(e,logs) {
    logs.map(eventLogger);
  });
};

window.onload = function() {
  ipfs.setProvider(ipfs.localProvider);
  loadTerms();
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
      isChangeable();
    }
    account = accounts[0];
    checkAcceptance();
    refreshBalance();
    isChangeable();
    eventListener();
  });
}
