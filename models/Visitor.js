const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, index: true },
    userAgent: String,
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    device: String,        // desktop / mobile / tablet
    deviceVendor: String,
    deviceModel: String,
    isBot: { type: Boolean, default: false },

    // Approx geo from IP (using free ip-api via axios)
    country: String,
    region: String,
    city: String,
    isp: String,
    lat: Number,
    lon: Number,
    timezone: String,

    // Page context
    path: { type: String, index: true },
    referrer: String,
    language: String,
    screenResolution: String,
    metaPixelId: String,

    // Session-ish info
    sessionId: { type: String, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Meta Pixel event fired
    pixelFired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);