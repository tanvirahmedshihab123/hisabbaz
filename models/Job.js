const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    tag: { type: String, required: true },
    title: { type: String, required: true },
    heroSubtitle: String,
    location: String,
    employmentType: String,
    department: String,
    postedAgo: String,
    sections: [
      {
        type: { type: String, enum: ["text", "list"], required: true },
        title: String,
        text: String,
        items: [String],
      },
    ],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);