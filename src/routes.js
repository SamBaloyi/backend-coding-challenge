const express = require("express");
const router = express.Router();
const messageController = require("./controllers/messagesController");
const authController = require("./controllers/authController");
const debugController = require("./controllers/debugController");
const {authenticate} = require("./middleware/auth");

// Auth routes
router.post("/register", authController.register);

// Message routes
router.post("/messages", authenticate, messageController.storeMessage);
router.get("/messages/:userId", authenticate, messageController.getMessages);

// Debug route
router.post("/debug/decrypt", debugController.debugDecrypt);

module.exports = router;
