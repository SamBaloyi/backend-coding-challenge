const crypto = require('crypto');

// The broken decrypt function from debug_code.js
function brokenDecrypt(encryptedData, key, iv) {
  // Convert inputs to proper format
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  
  // THIS IS BROKEN:
  // The issue is that we're using createCipheriv instead of createDecipheriv
  // A cipher is for encryption, not decryption
  const decipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

// The fixed decrypt function
function fixedDecrypt(encryptedData, key, iv) {
  // Convert inputs to proper format
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  
  // FIXED VERSION:
  // Using createDecipheriv instead of createCipheriv for decryption
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

// Test case to reproduce the decrypt bug
function testDecryptionFix() {
  // First, encrypt some data
  const message = 'This is a test message';
  const key = crypto.randomBytes(32);  // AES-256 key
  const iv = crypto.randomBytes(16);   // IV for AES-CBC
  
  // Encrypt
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const encryptedBase64 = encrypted.toString('base64');
  
  // Try to decrypt with broken function (this will throw an error)
  try {
    const brokenResult = brokenDecrypt(
      encryptedBase64, 
      key.toString('hex'), 
      iv.toString('hex')
    );
    console.log('Broken Decryption (should fail):', brokenResult);
  } catch (error) {
    console.log('Expected error from broken function:', error.message);
  }
  
  // Decrypt with fixed function (this should work)
  try {
    const fixedResult = fixedDecrypt(
      encryptedBase64, 
      key.toString('hex'), 
      iv.toString('hex')
    );
    console.log('Fixed Decryption:', fixedResult);
    console.log('Matches original?', fixedResult === message);
  } catch (error) {
    console.log('Unexpected error in fixed function:', error.message);
  }
}

module.exports = {
  brokenDecrypt,
  fixedDecrypt,
  testDecryptionFix
};