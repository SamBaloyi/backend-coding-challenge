const crypto = require('crypto');

// Broken decrypt function that needs to be fixed
function broken_decrypt(encryptedData, key, iv) {
  // Convert inputs to proper format
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  
  // THIS IS THE BUG: Using createCipheriv instead of createDecipheriv
  // A cipher is used for encryption, not decryption
  const decipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

// Export the function
module.exports = {
  broken_decrypt
};