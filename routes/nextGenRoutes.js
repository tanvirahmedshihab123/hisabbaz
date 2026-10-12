const express = require("express");
const router = express.Router();
const {
  getConfig,
  submitApplication, checkStatus
} = require("../controllers/nextGenController");


/* Public routes */
router.get("/config", getConfig);
router.post("/apply", submitApplication);
router.get("/status", checkStatus);

module.exports = router;