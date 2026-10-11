const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    question: String,
    answer: String,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobSlug: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    currentLocation: String,
    experienceYears: String,
    currentCompany: String,
    expectedSalary: String,
    noticePeriod: String,
    linkedinUrl: String,
    portfolioUrl: String,
    githubUrl: String,
    coverLetter: String,
    answers: [answerSchema],
    cvUrl: { type: String, required: true }, // Cloudinary URL
    cvPublicId: String,
    status: {
      type: String,
      enum: ["submitted", "under_review", "shortlisted", "interview", "rejected", "hired"],
      default: "submitted",
    },
    adminNotes: String,
    // Visitor info at application time
    submittedIp: String,
    submittedUserAgent: String,
  },
  { timestamps: true }
);

// Prevent duplicate applications per user per job
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("JobApplication", applicationSchema);