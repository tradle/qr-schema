
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

  message ApplyForProduct {
    required string host = 1;
    required bytes provider = 2;
    required string product = 3;
    optional bytes contextId = 4;
  }

  message IdentityStub {
    required bytes permalink = 1;
    required bytes link = 2;
  }

  message Profile {
    required bytes permalink = 1;
    required bytes link = 2;
    required string firstName = 3;
    optional string lastName = 4;
  }
`)
