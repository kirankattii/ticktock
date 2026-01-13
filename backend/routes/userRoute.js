const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser } = require("../controllers/UserController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.post("/logout", authMiddleware, logoutUser);
router.get("/get", authMiddleware, getUser);

module.exports = router;