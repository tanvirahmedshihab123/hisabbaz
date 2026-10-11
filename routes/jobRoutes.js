const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");

// Public
router.get("/", getJobs);
router.get("/:slug", getJobBySlug);

// Admin
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;