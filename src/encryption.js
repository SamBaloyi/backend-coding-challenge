const crypto = require("crypto");

const SECRET_KEY = crypto.randomBytes(32);

function encryptMessage(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);

  let encrypted = cipher.update(message, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decryptMessage(encryptedMessage) {
  const [ivHex, encrypted] = encryptedMessage;
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };
