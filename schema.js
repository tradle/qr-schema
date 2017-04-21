
module.exports = require('protocol-buffers')(`
  message ImportData {
    required bytes provider = 1;
    required bytes dataHash = 2;
    optional string host = 3;
  }

  message AddProvider {
    required string host = 1;
    required bytes provider = 2;
  }
`)
