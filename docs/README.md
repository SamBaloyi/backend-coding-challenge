# 🔐 Secure Messaging API - Backend Coding Challenge

This challenge is designed to test your backend skills in API design,
encryption, debugging, and secure data handling. You are expected to
think critically, solve problems creatively, and structure your solution
with best coding practices. You may use either **Express (Node.js)** or
**Flask (Python)**.

## ⏱ Time Limit

**1 Hour** --- Please manage your time accordingly.

## 🎯 Objective

Build a secure messaging backend with three main features:

1.  Store encrypted messages per user using secure encryption.
2.  Allow only the original user to decrypt and retrieve messages.
3.  Debug a broken decryption function and explain your fix.

## 📦 Required Endpoints

### 1. POST /messages

Store a message for a user. Encrypt it using AES before storage.

### 2. GET /messages/:userId

Retrieve all messages for the specified user (after decryption).

### 3. POST /debug/decrypt

Debug and fix the broken decryption logic provided in the file
`debug_code.py` or `debug_code.js`.

## 🔐 Encryption Rules

-   Use **AES (AES-256)** encryption only.
-   like `pycryptodome` or `crypto-js`.
-   Use only:
    -   `crypto` module in Node.js
    -   `cryptography` or built-in `hashlib + hmac` in Python
-   IV must be random per message and embedded in the encrypted payload
    so it can be extracted and reused for decryption.
-   Return encrypted values in `base64` format.

## 🧠 Required Design Write-Up

Include this in your README or code comments before implementation:

1.  What encryption method and mode did you choose, and why?
2.  How will you ensure only the original user can access their
    messages?
3.  How do you plan to store and later extract the IV?
4.  How would you prevent user ID spoofing to access other users\'
    messages?

## 🐞 Debug Task

Inside the file `debug_code.py` or `debug_code.js` is a broken function
`broken_decrypt()`.

You must:

-   Identify and fix the issue.
-   Write a test case that reproduces the problem.
-   Comment your fix explaining what went wrong and why your fix works.

## ✅ Evaluation Criteria

-   Correct and working encryption/decryption logic
-   Clean, readable, and modular code structure
-   Secure handling of message data and per-user access
-   Thoughtful answers to the design questions
-   Successful debugging with clear explanation
-   Edge case handling and meaningful error responses

## 🚀 Bonus (Optional)

-   Implement message expiry (auto-delete after 10 minutes)
-   Add basic token-based authentication
-   Write unit tests for encryption, storage, and retrieval

## 📥 Submission

-   Submit your full project folder via zip or GitHub repository.
-   Include a `README.md` with:
    -   Instructions to run the project
    -   Your answers to the design questions
    -   Any assumptions or constraints you considered

**Reminder:** Write professional-grade, clean, and thoughtful code.
Structure your project clearly and keep logic modular. We\'ll be
reviewing both code and reasoning.
