const { fixedDecrypt } = require('../services/debugService');

// Debug decrypt endpoint
exports.debugDecrypt = (req, res) => {
  const { encryptedData, key, iv } = req.body;
  
  // Validate input
  if (!encryptedData || !key || !iv) {
    return res.status(400).json({ error: 'encryptedData, key, and iv are required' });
  }
  
  try {
    // Using the fixed function
    const decrypted = fixedDecrypt(encryptedData, key, iv);
    res.json({ decrypted });
  } catch (error) {
    console.error('Debug decrypt error:', error);
    res.status(500).json({ error: 'Failed to decrypt data' });
  }
};