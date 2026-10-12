// const Job = require("../models/Job");

// /* ── Public list ──────────────────────────── */
// const getJobs = async (req, res, next) => {
//   try {
//     const jobs = await Job.find({ isActive: true }).sort("order title");
//     res.json({ success: true, count: jobs.length, jobs });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── Public single job ────────────────────── */
// const getJobBySlug = async (req, res, next) => {
//   try {
//     const job = await Job.findOne({ slug: req.params.slug });
//     if (!job)
//       return res
//         .status(404)
//         .json({ success: false, message: "Job not found" });
//     res.json({ success: true, job });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── Admin: create ────────────────────────── */
// const createJob = async (req, res, next) => {
//   try {
//     const job = await Job.create(req.body);
//     res.status(201).json({ success: true, job });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── Admin: update ────────────────────────── */
// const updateJob = async (req, res, next) => {
//   try {
//     const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!job)
//       return res
//         .status(404)
//         .json({ success: false, message: "Job not found" });
//     res.json({ success: true, job });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ── Admin: delete ────────────────────────── */
// const deleteJob = async (req, res, next) => {
//   try {
//     const job = await Job.findByIdAndDelete(req.params.id);
//     if (!job)
//       return res
//         .status(404)
//         .json({ success: false, message: "Job not found" });
//     res.json({ success: true, message: "Job deleted" });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   getJobs,
//   getJobBySlug,
//   createJob,
//   updateJob,
//   deleteJob,
// };

const Job = require("../models/Job");

/* ══════════════════════════════════════════════════════
   Normalizer — ensures the frontend always gets the
   same shape, with sensible defaults for missing fields.
   ══════════════════════════════════════════════════════ */
const normalizeJob = (job) => ({
  _id: job._id,
  slug: job.slug,
  tag: job.tag || "Open Position",
  title: job.title,
  heroSubtitle: job.heroSubtitle || "",
  location: job.location || "Dhaka / Hybrid",
  employmentType: job.employmentType || "Full-time",
  department: job.department || "General",
  postedAgo: job.postedAgo || "Posted recently",
  sections: job.sections || [],
  isActive: job.isActive,
  order: job.order || 0,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

/* ── @route GET /api/jobs ─── public ──────────────── */
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort("order title");
    const normalized = jobs.map(normalizeJob);
    res.json({ success: true, count: normalized.length, jobs: normalized });
  } catch (err) {
    next(err);
  }
};

/* ── @route GET /api/jobs/:slug ─── public ────────── */
const getJobBySlug = async (req, res, next) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job: normalizeJob(job) });
  } catch (err) {
    next(err);
  }
};

/* ── @route POST /api/jobs ─── admin ──────────────── */
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job: normalizeJob(job) });
  } catch (err) {
    next(err);
  }
};

/* ── @route PUT /api/jobs/:id ─── admin ───────────── */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job: normalizeJob(job) });
  } catch (err) {
    next(err);
  }
};

/* ── @route DELETE /api/jobs/:id ─── admin ────────── */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
};