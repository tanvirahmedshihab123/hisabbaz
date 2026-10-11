const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");
const Payment = require("../models/Payment");
const Visitor = require("../models/Visitor");
const Job = require("../models/Job");

/* ═══ Dashboard ═══ */
router.get("/dashboard", protect, adminOnly, async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalApplications,
      pendingApplications,
      totalPayments,
      successfulPayments,
      totalVisitors,
      totalJobs,
    ] = await Promise.all([
      User.countDocuments(),
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: "submitted" }),
      Payment.countDocuments(),
      Payment.countDocuments({ status: "success" }),
      Visitor.countDocuments(),
      Job.countDocuments({ isActive: true }),
    ]);

    const revenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const appsByStatus = await JobApplication.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentApplications = await JobApplication.find()
      .populate("user", "name email")
      .populate("job", "title slug")
      .sort("-createdAt")
      .limit(5);

    const recentPayments = await Payment.find()
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        pendingApplications,
        totalPayments,
        successfulPayments,
        totalVisitors,
        totalJobs,
        totalRevenue,
        appsByStatus,
      },
      recentApplications,
      recentPayments,
    });
  } catch (err) {
    next(err);
  }
});

/* ═══ Users list ═══ */
router.get("/users", protect, adminOnly, async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
});

/* ═══ Change role ═══ */
router.patch("/users/:id/role", protect, adminOnly, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["applicant", "admin", "superadmin"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

/* ═══ Delete user ═══ */
router.delete("/users/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete yourself" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;