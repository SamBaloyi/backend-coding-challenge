const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// User registration
exports.register = (req, res) => {
  const { userId, password } = req.body;
  
  // Validate input
  if (!userId || !password) {
    return res.status(400).json({ error: 'userId and password are required' });
  }
  
  // In a real app, I would hash the password and store user information
  // For this challenge, we'll just generate a token
  
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  
  res.status(201).json({ token });
};  