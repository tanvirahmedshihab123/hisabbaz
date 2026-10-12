const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    question: String,
    answer: String,
  },
  { _id: false }
);

const nextGenApplicationSchema = new mongoose.Schema(
  {
    // ═══ Personal Info ═══
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    whatsapp: { type: String, trim: true },
    dob: { type: String, trim: true },

    // ═══ Address ═══
    presentDivision: String,
    presentDistrict: String,
    presentUpazila: String,
    presentVillage: String,

    permanentDivision: String,
    permanentDistrict: String,
    permanentUpazila: String,
    permanentVillage: String,

    // ═══ Education & Career ═══
    highestEducation: String,
    sscPassYear: String,
    currentProfession: String,
    skills: String,
    workExperience: String,
    portfolioUrl: String,

    // ═══ Business & Interest ═══
    hasBusinessIdea: { type: Boolean, default: false },
    interestedInMarketingOfficer: { type: Boolean, default: false },
    hasDeviceAccess: { type: Boolean, default: false },
    readyForRealProblems: { type: Boolean, default: false },

    // ═══ Refund Info ═══
    refundNumber: { type: String, trim: true },
    refundMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket", ""],
      default: "",
    },

    // ═══ Custom Answers ═══
    answers: [answerSchema],

    // ═══ Consent ═══
    declarationAccepted: { type: Boolean, default: false },

    // ═══ Application State ═══
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
        "winner",
      ],
      default: "submitted",
    },
    adminNotes: String,

    // ═══ Tracking ═══
    submittedIp: String,
    submittedUserAgent: String,

    // ═══ Optional User Link (if they were logged in) ═══
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ═══ Payment / Deposit ═══
    depositPaid: { type: Boolean, default: false },
    depositTransactionId: String,
    depositRefunded: { type: Boolean, default: false },
    depositRefundedAt: Date,
  },
  { timestamps: true }
);

nextGenApplicationSchema.index({ mobile: 1 }, { unique: true });
nextGenApplicationSchema.index({ email: 1 }, { sparse: true });

module.exports = mongoose.model("NextGenApplication", nextGenApplicationSchema);