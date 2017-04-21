
module.exports = require('protocol-buffers')(`
  message ImportData {
    required string provider = 1;
    required string dataHash = 2;
    optional string host = 3;
  }

  message AddProvider {
    required string host = 1;
    required string provider = 2;
  }
`)
