const crypto = require('crypto');
const { SERVER_SECRET } = require('../config');

// In-memory storage for messages (would use a database in production)
const messages = {};

// Generate a user-specific encryption key
function getUserKey(userId) {
  return crypto.createHash('sha256')
    .update(userId + SERVER_SECRET)
    .digest();
}

// Encrypt a message using AES-256-CBC
function encryptMessage(message, userId) {
  const iv = crypto.randomBytes(16); // Generate random IV
  const key = getUserKey(userId);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Combine IV and encrypted data
  const ivBase64 = iv.toString('base64');
  return `${ivBase64}:${encrypted}`;
}

// Decrypt a message using AES-256-CBC
function decryptMessage(encryptedData, userId) {
  const [ivBase64, encryptedMessage] = encryptedData.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const key = getUserKey(userId);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// BONUS: Message auto-expiry implementation
function setupMessageExpiry() {
  // Check for expired messages every minute
  setInterval(() => {
    const now = Date.now();
    const expiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    // Check messages for each user
    Object.keys(messages).forEach(userId => {
      if (messages[userId] && messages[userId].length) {
        // Filter out expired messages
        messages[userId] = messages[userId].filter(msg => {
          return (now - msg.timestamp) < expiryTime;
        });
      }
    });
    
    console.log('Expired messages cleaned up');
  }, 60 * 1000); // Run every minute
}

module.exports = {
  messages,
  getUserKey,
  encryptMessage,
  decryptMessage,
  setupMessageExpiry
};