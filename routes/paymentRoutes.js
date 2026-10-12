const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  epsCallback,
  getAllPayments,initializeNextGenDeposit,   // ⬅️ ADD
  verifyNextGenDeposit, 
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");

router.post("/initialize", protect, initializePayment);
router.get("/verify/:merchantTransactionId", protect, verifyPayment);
router.post("/callback", epsCallback);
router.post("/nextgen-deposit", initializeNextGenDeposit);
router.get("/nextgen-verify/:merchantTransactionId", verifyNextGenDeposit); // public — EPS posts here

// Admin
router.get("/", protect, adminOnly, getAllPayments);

module.exports = router;