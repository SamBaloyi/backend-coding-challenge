const dotenv = require("dotenv")
dotenv.config()
// In a real application, these would be secured properly (environment variables)
const SERVER_SECRET = process.env.SERVER_SECRET || 'super-secret-server-key-do-not-share';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-auth-secret-key-for-token-generation';

module.exports = {
  SERVER_SECRET,
  JWT_SECRET
};