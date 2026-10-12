const express = require("express");
const router = express.Router();
const {
  getConfig,
  submitApplication,
} = require("../controllers/nextGenController");

/* Public routes */
router.get("/config", getConfig);
router.post("/apply", submitApplication);

module.exports = router;