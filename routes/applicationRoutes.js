const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");
const upload = require("../utils/upload");

/* ═══════════════════════════════════════════════
   Route order matters!
   ═══════════════════════════════════════════════ */

/* Admin: list all */
router.get("/", protect, adminOnly, getAllApplications);

/* User: own applications */
router.get("/my", protect, getMyApplications);

/* Admin: single by ID */
router.get("/:id", protect, adminOnly, getApplicationById);

/* Admin: update status */
router.patch("/:id", protect, adminOnly, updateApplicationStatus);

/* User: submit (dynamic LAST) */
router.post("/:jobSlug", protect, upload.single("cv"), submitApplication);

module.exports = router;