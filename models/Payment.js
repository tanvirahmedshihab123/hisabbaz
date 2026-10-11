const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: String, required: true },       // starter, growth, scale, enterprise
    planName: String,
    billingCycle: { type: String, enum: ["monthly", "yearly"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },

    // EPS gateway fields
    merchantTransactionId: { type: String, required: true, unique: true, index: true },
    epsTransactionId: String,
    customerOrderId: String,
    storeId: String,

    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed }, // raw EPS response

    // Customer snapshot
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

module.exports = mongoose.model("Payment", paymentSchema);