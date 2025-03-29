// jest.config.js
module.exports = {
    // Disable watchman to avoid permission issues
    watchman: false,
    
    // Other Jest configuration options
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage'
  };