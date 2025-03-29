// tests.js - Unit tests for the secure messaging API

const request = require('supertest');
const server = require('../server');
const crypto = require('crypto');

describe('Secure Messaging API', () => {
  let token;
  const userId = 'testuser';
  
  // Setup: register a test user and get token
  beforeAll(async () => {
    const res = await request(server)
      .post('/register')
      .send({ userId, password: 'password123' });
    
    token = res.body.token;
  });
  
  // Test message storage
  test('should store an encrypted message', async () => {
    const res = await request(server)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        userId, 
        message: 'This is a test message' 
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('messageId');
    expect(res.body).toHaveProperty('status', 'Message stored successfully');
  });
  
  // Test message retrieval
  test('should retrieve and decrypt messages', async () => {
    // First store a message
    await request(server)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        userId, 
        message: 'Another test message' 
      });
    
    // Then retrieve messages
    const res = await request(server)
      .get(`/messages/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);
    
    // Verify messages are decrypted correctly
    const containsTestMessage = res.body.messages.some(msg => 
      msg.message === 'Another test message'
    );
    expect(containsTestMessage).toBe(true);
  });
  
  // Test authentication
  test('should reject requests without valid auth', async () => {
    const res = await request(server)
      .get(`/messages/${userId}`);
    
    expect(res.statusCode).toBe(401);
  });
  
  // Test user access control
  test('should prevent access to other users\' messages', async () => {
    const otherUserId = 'otheruser';
    
    const res = await request(server)
      .get(`/messages/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(403);
  });
  
  // Test debug decryption fix
  test('should correctly decrypt with fixed function', async () => {
    // Encrypt some test data
    const message = 'Test message for debug endpoint';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Send to debug endpoint
    const res = await request(server)
      .post('/debug/decrypt')
      .send({
        encryptedData: encrypted.toString('base64'),
        key: key.toString('hex'),
        iv: iv.toString('hex')
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('decrypted', message);
  });
});