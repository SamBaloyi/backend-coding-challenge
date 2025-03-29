# Secure Messaging API

This project implements a secure messaging API with encryption/decryption capabilities for storing and retrieving messages per user.

## Setup and Running Instructions

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Run the server**:
   ```
   npm start
   ```
   
   The server will start on port 3000 by default (or the port specified in the PORT environment variable).

3. **Run tests** (if implemented):
   ```
   npm test
   ```

## API Endpoints

### 1. POST /register
Registers a new user and returns a JWT token for authentication.

**Request Body**:
```json
{
  "userId": "user123",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. POST /messages
Store an encrypted message for a user.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "userId": "user123",
  "message": "This is a secret message!"
}
```

**Response**:
```json
{
  "messageId": "a1b2c3d4e5f6",
  "status": "Message stored successfully"
}
```

### 3. GET /messages/:userId
Retrieve all decrypted messages for a specific user.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**:
```json
{
  "messages": [
    {
      "id": "a1b2c3d4e5f6",
      "message": "This is a secret message!",
      "timestamp": 1647352624000
    }
  ]
}
```

### 4. POST /debug/decrypt
Debug endpoint to test the decryption function.

**Request Body**:
```json
{
  "encryptedData": "base64-encoded-encrypted-data",
  "key": "hex-encoded-key",
  "iv": "hex-encoded-iv"
}
```

**Response**:
```json
{
  "decrypted": "Original message"
}
```

## Design Decisions

### 1. Encryption Method and Mode

I chose **AES-256-CBC** (Cipher Block Chaining) mode for the following reasons:

- **Security**: AES-256 provides strong encryption with a 256-bit key length, resistant to brute force attacks
- **Reliability**: CBC mode with proper IV handling protects against patterns in encrypted output
- **Compatibility**: Widely supported in crypto libraries and standardized
- **Flexibility**: Works well for messages of varying lengths
- **Performance**: Good balance between security and computation speed

### 2. Ensuring Only Original User Can Access Messages

I implemented several layers of security:

- **User-specific encryption keys**: Each message is encrypted with a key derived from the user's ID and a server secret
- **Authentication middleware**: JWT-based authentication verifies the user's identity
- **Authorization checks**: Requests are validated to ensure users can only access their own messages
- **Per-message unique IV**: Each message has its own initialization vector

This approach ensures that even if someone obtains another user's encrypted messages, they cannot decrypt them without the correct user-specific key.

### 3. Storing and Extracting the IV

For each message encryption:

- A random 16-byte IV is generated
- The IV is prepended to the encrypted data, separated by a colon
- The combined data is encoded as base64
- During decryption, the IV is extracted by splitting the string at the colon

This method ensures the IV is:
- Unique for each message
- Easily retrievable during decryption
- Inseparably linked to its corresponding encrypted message

### 4. Preventing User ID Spoofing

To prevent user ID spoofing, I implemented:

- **Token-based authentication**: JWTs contain the user's ID and are signed to prevent tampering
- **Server-side validation**: Each request compares the authenticated user ID with the requested resource's user ID
- **Authorization checks**: Users can only access resources associated with their own ID
- **User-specific encryption**: Even if authentication is bypassed, messages remain encrypted with user-specific keys

## Debug Task Solution

### Bug Identified

In the `broken_decrypt()` function, the issue was:

- Using `crypto.createCipheriv()` instead of `crypto.createDecipheriv()`
- A cipher is used for encryption, not decryption
- This causes the function to attempt to re-encrypt already encrypted data rather than decrypt it

### Fix

The fix was to replace:
```javascript
const decipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
```

With:
```javascript
const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
```

This ensures we're using the proper decryption operation.

### Test Case

I created a test case that:
1. Encrypts a message using proper methods
2. Attempts to decrypt with the broken function (which throws an error)
3. Successfully decrypts with the fixed function
4. Verifies the decrypted message matches the original

This validates that our fix resolves the issue.

## Bonus Features Implemented

1. **Message Expiry**:
   - Messages automatically expire after 10 minutes
   - A background process runs every minute to clean up expired messages

2. **Token-based Authentication**:
   - JWT-based authentication for all message operations
   - Tokens include user ID and expire after 1 hour

## Security Considerations

1. **Key Management**:
   - In a production environment, server secrets and JWT secrets would be stored securely using environment variables or a secret management service

2. **Data Storage**:
   - This implementation uses in-memory storage for simplicity
   - In production, a database with proper access controls would be used

3. **Input Validation**:
   - All endpoints validate inputs before processing

4. **Error Handling**:
   - Secure error handling avoids leaking sensitive information

## Assumptions and Constraints

1. The system assumes unique user IDs.
2. In-memory message storage is used for simplicity (not persistent).
3. The implementation focuses on the encryption/decryption logic rather than authentication complexity.
4. Password hashing is simplified for this challenge.
