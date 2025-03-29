const crypto = require('crypto');
const { encryptMessage, decryptMessage, messages } = require('../services/messageService');

// Store a message for a user
exports.storeMessage = (req, res) => {
  const { userId, message } = req.body;
  
  // Validate input
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }
  
  // Ensure users can only save messages for themselves
  if (req.user.userId !== userId) {
    return res.status(403).json({ error: 'You can only save messages for your own user ID' });
  }
  
  try {
    // Encrypt the message
    const encryptedMessage = encryptMessage(message, userId);
    
    // Store the encrypted message
    if (!messages[userId]) {
      messages[userId] = [];
    }
    
    const messageObj = {
      id: crypto.randomBytes(8).toString('hex'),
      encrypted: encryptedMessage,
      timestamp: Date.now()
    };
    
    messages[userId].push(messageObj);
    
    res.status(201).json({ 
      messageId: messageObj.id,
      status: 'Message stored successfully' 
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Failed to encrypt and store message' });
  }
};

// Retrieve messages for a user
exports.getMessages = (req, res) => {
  const { userId } = req.params;
  
  // Ensure users can only access their own messages
  if (req.user.userId !== userId) {
    return res.status(403).json({ error: 'You can only access your own messages' });
  }
  
  try {
    // Get messages for the user
    const userMessages = messages[userId] || [];
    
    // Decrypt messages
    const decryptedMessages = userMessages.map(msg => {
      try {
        return {
          id: msg.id,
          message: decryptMessage(msg.encrypted, userId),
          timestamp: msg.timestamp
        };
      } catch (error) {
        return {
          id: msg.id,
          error: 'Failed to decrypt message',
          timestamp: msg.timestamp
        };
      }
    });
    
    res.json({ messages: decryptedMessages });
  } catch (error) {
    console.error('Retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};