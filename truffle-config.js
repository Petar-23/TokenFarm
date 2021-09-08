require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    swapdex: {
      host: "https://swapdex.starkleytech.com/rpc",
      port: 443,
      network_id: "142", // Match any network id
      gas: 4700000
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
