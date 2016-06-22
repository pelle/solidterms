var ipfs = require('browser-ipfs');
var bs58 = require('bs58');
var Buffer = require('buffer');

module.exports = { ipfs: ipfs,
                   bs58: bs58,
                   Buffer: Buffer }