# Ricardian Contracts for Solidity

A simple abstract contract for implementing Ricardian contracts as part of a SmartContract.

In this case there is a an offerer, which is initially the address creating the contract.

- The offerer creates a contract like a terms of service and uploads it to IPFS.
- The resulting ipfs hash is added to the contract using the `changeContract` function
- At this point the contract is considered active
- Other parties can call the `accept()` function providing the same ipfs hash
- This is recorded as an acceptance of the contract by the msg.sender
- The contract author can mark functions as hasAccepted, which means that they are only allowed to be used by parties who have accepted the agreement

## Changing the contract

The offerer can change the agreement using the same `changeContract` function

To force parties to accept the new agreement, a modifier `hasAcceptedLatest` can be used on functions

## Running example:

You need a local ipfs node running at the moment or change code in app.js to point at a public one.

Install truffle and testrpc

```
npm install -g truffle
npm install -g ethereumjs-testrpc
```

In a terminal start testrpc:

`testrpc`

In another terminal install the contract and run the server:

```
truffle deploy
truffle serve
```

[Try it out](http://localhost:8080)