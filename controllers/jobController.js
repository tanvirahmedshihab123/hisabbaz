const Job = require("../models/Job");

/* ── Public list ──────────────────────────── */
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort("order title");
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

/* ── Public single job ────────────────────── */
const getJobBySlug = async (req, res, next) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/* ── Admin: create ────────────────────────── */
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/* ── Admin: update ────────────────────────── */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/* ── Admin: delete ────────────────────────── */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
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