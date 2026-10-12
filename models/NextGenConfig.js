const mongoose = require("mongoose");

const nextGenConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
    },

    // ═══ Prize Pool ═══
    prizes: [
      {
        position: Number,
        amount: Number,
        label: String,
        _id: false,
      },
    ],
    totalPrizePool: Number,

    // ═══ Deposit ═══
    depositAmount: { type: Number, default: 200 },
    depositEnabled: { type: Boolean, default: true },
    depositInstructions: String,

    // ═══ Content Sections (all editable) ═══
    heroTitle: String,
    heroSubtitle: String,
    heroBadge: String,

    philosophyTitle: String,
    philosophyText: String,

    eligibilityMinQualification: String,
    eligibilityTraits: [String],

    marketingOfficerTitle: String,
    marketingOfficerText: String,
    marketingOfficerDuties: [String],

    benefits: [
      {
        title: String,
        description: String,
        _id: false,
      },
    ],

    // ═══ Application Open / Closed ═══
    applicationOpen: { type: Boolean, default: true },
    applicationDeadline: Date,
    maxApplications: Number,

    // ═══ Selection Process Steps ═══
    selectionSteps: [
      {
        title: String,
        description: String,
        order: Number,
        _id: false,
      },
    ],

    // ═══ FAQs ═══
    faqs: [
      {
        question: String,
        answer: String,
        _id: false,
      },
    ],

    // ═══ Custom Application Questions ═══
    customQuestions: [
      {
        questionId: String,
        question: String,
        type: { type: String, enum: ["text", "textarea"] },
        required: Boolean,
        _id: false,
      },
    ],

    // ═══ Marketing / Meta ═══
    contactEmail: String,
    contactPhone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("NextGenConfig", nextGenConfigSchema);