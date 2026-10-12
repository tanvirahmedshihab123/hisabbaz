const express = require("express");
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateConfig,
  getStats,
} = require("../controllers/nextGenController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/applications", getAllApplications);
router.get("/applications/:id", getApplicationById);
router.patch("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);
router.patch("/config", updateConfig);

module.exports = router;