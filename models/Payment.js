// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     planId: { type: String, required: true },       // starter, growth, scale, enterprise
//     planName: String,
//     billingCycle: { type: String, enum: ["monthly", "yearly"], required: true },
//     amount: { type: Number, required: true },
//     currency: { type: String, default: "BDT" },

//     // EPS gateway fields
//     merchantTransactionId: { type: String, required: true, unique: true, index: true },
//     epsTransactionId: String,
//     customerOrderId: String,
//     storeId: String,

//     status: {
//       type: String,
//       enum: ["pending", "success", "failed", "cancelled"],
//       default: "pending",
//     },
//     gatewayResponse: { type: mongoose.Schema.Types.Mixed }, // raw EPS response

//     // Customer snapshot
//     customerName: String,
//     customerEmail: String,
//     customerPhone: String,
//     customerAddress: String,
//     customerCity: String,
//     customerCountry: String,

//     paidAt: Date,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // ═══════════════════════════════════════════════
    // WHO (optional — NextGen doesn't require login)
    // ═══════════════════════════════════════════════
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ═══════════════════════════════════════════════
    // PURPOSE — distinguishes payment types
    // ═══════════════════════════════════════════════
    purpose: {
      type: String,
      enum: ["subscription", "nextgen_deposit"],
      default: "subscription",
      required: true,
    },

    // ═══════════════════════════════════════════════
    // SUBSCRIPTION FIELDS (purpose = "subscription")
    // ═══════════════════════════════════════════════
    planId: { type: String },          // starter, growth, scale, enterprise
    planName: String,
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },

    // ═══════════════════════════════════════════════
    // NEXTGEN DEPOSIT FIELDS (purpose = "nextgen_deposit")
    // ═══════════════════════════════════════════════
    nextGenApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NextGenApplication",
    },
    nextGenMobile: String,

    // ═══════════════════════════════════════════════
    // COMMON — amount
    // ═══════════════════════════════════════════════
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },

    // ═══════════════════════════════════════════════
    // EPS GATEWAY FIELDS
    // ═══════════════════════════════════════════════
    merchantTransactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    epsTransactionId: String,
    customerOrderId: String,
    storeId: String,

    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed }, // raw EPS response

    // ═══════════════════════════════════════════════
    // CUSTOMER SNAPSHOT (at payment time)
    // ═══════════════════════════════════════════════
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    customerAddress: String,
    customerCity: String,
    customerCountry: String,

    paidAt: Date,
  },
  { timestamps: true }
);

/* ═══ Indexes for fast admin queries ═══ */
paymentSchema.index({ purpose: 1, status: 1 });
paymentSchema.index({ nextGenApplicationId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);