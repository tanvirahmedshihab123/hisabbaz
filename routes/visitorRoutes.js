const express = require("express");
const router = express.Router();
const {
  trackVisitor,
  getVisitors,
  getVisitorStats,
} = require("../controllers/visitorController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");

// Public — client fires this after Meta Pixel loads
router.post("/track", trackVisitor);

// Admin
router.get("/", protect, adminOnly, getVisitors);
router.get("/stats", protect, adminOnly, getVisitorStats);

module.exports = router;