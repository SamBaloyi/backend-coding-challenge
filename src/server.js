// app.js - Main server file

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { setupMessageExpiry } = require('./services/messageService');
const { testDecryptionFix } = require('./services/debugService');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Initialise message expiry
setupMessageExpiry();

// Run the test case for decrypt bug
testDecryptionFix();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure messaging API server running on port ${PORT}`);
});

module.exports = app;