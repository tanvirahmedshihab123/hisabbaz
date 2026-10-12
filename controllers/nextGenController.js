const NextGenApplication = require("../models/NextGenApplication");
const NextGenConfig = require("../models/NextGenConfig");
const { getClientIp } = require("../utils/visitorParser");

/* ═══════════════════════════════════════════════
   GET /api/nextgen/config
   Public — returns everything the frontend needs
   ═══════════════════════════════════════════════ */
const getConfig = async (req, res, next) => {
  try {
    let config = await NextGenConfig.findOne({ key: "main" });
    if (!config) config = await NextGenConfig.create({ key: "main" });
    res.json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   POST /api/nextgen/apply
   Public — anyone can apply
   ═══════════════════════════════════════════════ */
const submitApplication = async (req, res, next) => {
  try {
    const config = await NextGenConfig.findOne({ key: "main" });

    if (config && !config.applicationOpen) {
      return res
        .status(400)
        .json({ success: false, message: "Applications are currently closed" });
    }

    if (
      config &&
      config.applicationDeadline &&
      new Date() > new Date(config.applicationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    const {
      fullName,
      fatherName,
      motherName,
      mobile,
      email,
      whatsapp,
      dob,
      presentDivision,
      presentDistrict,
      presentUpazila,
      presentVillage,
      permanentDivision,
      permanentDistrict,
      permanentUpazila,
      permanentVillage,
      highestEducation,
      sscPassYear,
      currentProfession,
      skills,
      workExperience,
      portfolioUrl,
      hasBusinessIdea,
      interestedInMarketingOfficer,
      hasDeviceAccess,
      readyForRealProblems,
      refundNumber,
      refundMethod,
      answers,
      declarationAccepted,
    } = req.body;

    // Required
    if (!fullName || !fatherName || !motherName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Full name, father name, mother name and mobile are required",
      });
    }

    if (!declarationAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must accept the declaration",
      });
    }

    // Duplicate check
    const existing = await NextGenApplication.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An application with this mobile number already exists",
      });
    }

    let parsedAnswers = [];
    if (answers) {
      try {
        parsedAnswers =
          typeof answers === "string" ? JSON.parse(answers) : answers;
      } catch {
        parsedAnswers = [];
      }
    }

    const application = await NextGenApplication.create({
      fullName,
      fatherName,
      motherName,
      mobile,
      email,
      whatsapp,
      dob,
      presentDivision,
      presentDistrict,
      presentUpazila,
      presentVillage,
      permanentDivision,
      permanentDistrict,
      permanentUpazila,
      permanentVillage,
      highestEducation,
      sscPassYear,
      currentProfession,
      skills,
      workExperience,
      portfolioUrl,
      hasBusinessIdea: !!hasBusinessIdea,
      interestedInMarketingOfficer: !!interestedInMarketingOfficer,
      hasDeviceAccess: !!hasDeviceAccess,
      readyForRealProblems: !!readyForRealProblems,
      refundNumber,
      refundMethod,
      answers: parsedAnswers,
      declarationAccepted: !!declarationAccepted,
      user: req.user?._id,
      submittedIp: getClientIp(req),
      submittedUserAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        id: application._id,
        fullName: application.fullName,
        mobile: application.mobile,
        status: application.status,
        createdAt: application.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An application with this mobile number already exists",
      });
    }
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — List applications
   ═══════════════════════════════════════════════ */
const getAllApplications = async (req, res, next) => {
  try {
    const {
      status,
      search,
      division,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (division) query.presentDivision = division;
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { presentDistrict: new RegExp(search, "i") },
      ];
    }

    const apps = await NextGenApplication.find(query)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await NextGenApplication.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      applications: apps,
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — Get single
   ═══════════════════════════════════════════════ */
const getApplicationById = async (req, res, next) => {
  try {
    const app = await NextGenApplication.findById(req.params.id);
    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — Update status / notes
   ═══════════════════════════════════════════════ */
const updateApplication = async (req, res, next) => {
  try {
    const { status, adminNotes, depositPaid, depositRefunded } = req.body;

    const validStatuses = [
      "submitted",
      "under_review",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
      "winner",
    ];

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (depositPaid !== undefined) update.depositPaid = depositPaid;
    if (depositRefunded !== undefined) {
      update.depositRefunded = depositRefunded;
      if (depositRefunded) update.depositRefundedAt = new Date();
    }

    const app = await NextGenApplication.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — Delete
   ═══════════════════════════════════════════════ */
const deleteApplication = async (req, res, next) => {
  try {
    const app = await NextGenApplication.findByIdAndDelete(req.params.id);
    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, message: "Application deleted" });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — Update config
   ═══════════════════════════════════════════════ */
const updateConfig = async (req, res, next) => {
  try {
    const config = await NextGenConfig.findOneAndUpdate(
      { key: "main" },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════
   ADMIN — Stats for dashboard
   ═══════════════════════════════════════════════ */
const getStats = async (req, res, next) => {
  try {
    const [total, byStatus, byDivision] = await Promise.all([
      NextGenApplication.countDocuments(),
      NextGenApplication.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      NextGenApplication.aggregate([
        { $group: { _id: "$presentDivision", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      success: true,
      stats: { total, byStatus, byDivision },
    });
  } catch (err) {
    next(err);
  }
};

const checkStatus = async (req, res, next) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const app = await NextGenApplication.findOne({ mobile }).select(
      "fullName mobile status depositPaid depositRefunded createdAt adminNotes"
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "No application found with this mobile number",
      });
    }

    // Only return applicant-safe fields
    res.json({
      success: true,
      application: {
        fullName: app.fullName,
        mobile: app.mobile,
        status: app.status,
        depositPaid: app.depositPaid,
        depositRefunded: app.depositRefunded,
        createdAt: app.createdAt,
        // Status note shown to applicant
        applicantNote: app.adminNotes ? null : undefined, // don't leak admin notes
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   POST /api/nextgen/:id/mark-deposit-paid
   Called by payment verification to mark deposit paid
   ═══════════════════════════════════════════════════════ */
const markDepositPaid = async (applicationId, transactionId) => {
  return NextGenApplication.findByIdAndUpdate(
    applicationId,
    {
      depositPaid: true,
      depositTransactionId: transactionId,
    },
    { new: true }
  );
};

/* ═══════════════════════════════════════════════════════
   ADMIN — Assign task to applicant
   ═══════════════════════════════════════════════════════ */
const assignTask = async (req, res, next) => {
  try {
    const { taskTitle, taskDescription, dueDate } = req.body;

    if (!taskTitle) {
      return res
        .status(400)
        .json({ success: false, message: "Task title is required" });
    }

    const app = await NextGenApplication.findByIdAndUpdate(
      req.params.id,
      {
        assignedTask: {
          title: taskTitle,
          description: taskDescription || "",
          dueDate: dueDate || null,
          assignedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConfig,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateConfig,
  getStats,
  checkStatus,
  markDepositPaid,
  assignTask,
};