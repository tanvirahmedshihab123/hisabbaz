// const JobApplication = require("../models/JobApplication");
// const Job = require("../models/Job");
// const { getClientIp } = require("../utils/visitorParser");

// /* ── @route POST /api/applications/:jobSlug ── */
// const submitApplication = async (req, res, next) => {
//   try {
//     const { jobSlug } = req.params;
//     const {
//       fullName,
//       email,
//       phone,
//       currentLocation,
//       experienceYears,
//       currentCompany,
//       expectedSalary,
//       noticePeriod,
//       linkedinUrl,
//       portfolioUrl,
//       githubUrl,
//       coverLetter,
//       answers,
//     } = req.body;

//     if (!req.file)
//       return res
//         .status(400)
//         .json({ success: false, message: "CV (PDF) is required" });

//     if (!fullName || !email || !phone)
//       return res.status(400).json({
//         success: false,
//         message: "Full name, email and phone are required",
//       });

//     const job = await Job.findOne({ slug: jobSlug });
//     if (!job)
//       return res
//         .status(404)
//         .json({ success: false, message: "Job not found" });

//     const existing = await JobApplication.findOne({
//       user: req.user._id,
//       job: job._id,
//     });
//     if (existing)
//       return res.status(400).json({
//         success: false,
//         message: "You have already applied for this position",
//       });

//     let parsedAnswers = [];
//     if (answers) {
//       try {
//         parsedAnswers =
//           typeof answers === "string" ? JSON.parse(answers) : answers;
//       } catch {
//         parsedAnswers = [];
//       }
//     }

//     const application = await JobApplication.create({
//       user: req.user._id,
//       job: job._id,
//       jobSlug,
//       fullName,
//       email,
//       phone,
//       currentLocation,
//       experienceYears,
//       currentCompany,
//       expectedSalary,
//       noticePeriod,
//       linkedinUrl,
//       portfolioUrl,
//       githubUrl,
//       coverLetter,
//       answers: parsedAnswers,
//       cvUrl: req.file.path,
//       cvPublicId: req.file.filename,
//       submittedIp: getClientIp(req),
//       submittedUserAgent: req.headers["user-agent"],
//     });

//     res.status(201).json({
//       success: true,
//       message: "Application submitted successfully",
//       application: {
//         id: application._id,
//         jobSlug: application.jobSlug,
//         status: application.status,
//         createdAt: application.createdAt,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── @route GET /api/applications/my ─────── */
// const getMyApplications = async (req, res, next) => {
//   try {
//     const apps = await JobApplication.find({ user: req.user._id })
//       .populate("job", "title slug tag")
//       .sort("-createdAt");
//     res.json({ success: true, count: apps.length, applications: apps });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── @route GET /api/applications ─── admin ─ */
// const getAllApplications = async (req, res, next) => {
//   try {
//     const { status, jobSlug, page = 1, limit = 20 } = req.query;
//     const query = {};
//     if (status) query.status = status;
//     if (jobSlug) query.jobSlug = jobSlug;

//     const apps = await JobApplication.find(query)
//       .populate("user", "name email phone")
//       .populate("job", "title slug")
//       .sort("-createdAt")
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await JobApplication.countDocuments(query);

//     res.json({
//       success: true,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       applications: apps,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── @route GET /api/applications/:id ─── admin ─ */
// const getApplicationById = async (req, res, next) => {
//   try {
//     const app = await JobApplication.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("job", "title slug tag location employmentType");

//     if (!app) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Application not found" });
//     }

//     res.json({ success: true, application: app });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── @route PATCH /api/applications/:id ─── admin ─ */
// const updateApplicationStatus = async (req, res, next) => {
//   try {
//     const { status, adminNotes } = req.body;

//     const validStatuses = [
//       "submitted",
//       "under_review",
//       "shortlisted",
//       "interview",
//       "rejected",
//       "hired",
//     ];

//     if (status && !validStatuses.includes(status)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid status value" });
//     }

//     const update = {};
//     if (status) update.status = status;
//     if (adminNotes !== undefined) update.adminNotes = adminNotes;

//     const app = await JobApplication.findByIdAndUpdate(
//       req.params.id,
//       update,
//       { new: true, runValidators: true }
//     )
//       .populate("user", "name email phone")
//       .populate("job", "title slug");

//     if (!app) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Application not found" });
//     }

//     res.json({ success: true, application: app });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   submitApplication,
//   getMyApplications,
//   getAllApplications,
//   getApplicationById,
//   updateApplicationStatus,
// };

const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const { getClientIp } = require("../utils/visitorParser");

/* ── @route POST /api/applications/:jobSlug ── */
const submitApplication = async (req, res, next) => {
  try {
    const { jobSlug } = req.params;
    const {
      fullName,
      email,
      phone,
      currentLocation,
      experienceYears,
      currentCompany,
      expectedSalary,
      noticePeriod,
      linkedinUrl,
      portfolioUrl,
      githubUrl,
      coverLetter,
      answers,
    } = req.body;

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "CV (PDF) is required" });

    if (!fullName || !email || !phone)
      return res.status(400).json({
        success: false,
        message: "Full name, email and phone are required",
      });

    const job = await Job.findOne({ slug: jobSlug });
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });

    const existing = await JobApplication.findOne({
      user: req.user._id,
      job: job._id,
    });
    if (existing)
      return res.status(400).json({
        success: false,
        message: "You have already applied for this position",
      });

    let parsedAnswers = [];
    if (answers) {
      try {
        parsedAnswers =
          typeof answers === "string" ? JSON.parse(answers) : answers;
      } catch {
        parsedAnswers = [];
      }
    }

    /* ═══ CV URL normalization — force .pdf extension ═══ */
    const rawUrl = req.file.path;                 // Cloudinary URL
    const publicId = req.file.filename;           // includes .pdf (from upload.js)

    const cvUrl = rawUrl.toLowerCase().endsWith(".pdf")
      ? rawUrl
      : `${rawUrl}.pdf`;

    const application = await JobApplication.create({
      user: req.user._id,
      job: job._id,
      jobSlug,
      fullName,
      email,
      phone,
      currentLocation,
      experienceYears,
      currentCompany,
      expectedSalary,
      noticePeriod,
      linkedinUrl,
      portfolioUrl,
      githubUrl,
      coverLetter,
      answers: parsedAnswers,
      cvUrl,                        // ✅ always ends with .pdf
      cvPublicId: publicId,
      submittedIp: getClientIp(req),
      submittedUserAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        id: application._id,
        jobSlug: application.jobSlug,
        status: application.status,
        createdAt: application.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── @route GET /api/applications/my ─────── */
const getMyApplications = async (req, res, next) => {
  try {
    const apps = await JobApplication.find({ user: req.user._id })
      .populate("job", "title slug tag")
      .sort("-createdAt");
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    next(err);
  }
};

/* ── @route GET /api/applications ─── admin ─ */
const getAllApplications = async (req, res, next) => {
  try {
    const { status, jobSlug, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (jobSlug) query.jobSlug = jobSlug;

    const apps = await JobApplication.find(query)
      .populate("user", "name email phone")
      .populate("job", "title slug")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await JobApplication.countDocuments(query);

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

/* ── @route GET /api/applications/:id ─── admin ─ */
const getApplicationById = async (req, res, next) => {
  try {
    const app = await JobApplication.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("job", "title slug tag location employmentType");

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

/* ── @route PATCH /api/applications/:id ─── admin ─ */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = [
      "submitted",
      "under_review",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
    ];

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const app = await JobApplication.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone")
      .populate("job", "title slug");

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
  submitApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};