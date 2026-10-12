require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const visitorTracker = require("./middleware/visitorTracker");
const nextGenRoutes = require("./routes/nextGenRoutes");
const adminNextGenRoutes = require("./routes/adminNextGenRoutes");


/* ── Routes ── */
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ⬅️ NEW

const app = express();

/* ── Database ── */
connectDB();

/* ── Security & Parsing ── */
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ── Rate limiting ── */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, try again later." },
});
app.use("/api", apiLimiter);

/* ── Visitor tracking ── */
app.use(visitorTracker);

/* ── Health check ── */
app.get("/", (req, res) =>
  res.json({ success: true, message: "Hisab Bazz API is running" })
);

/* ── Route Mounts ── */
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes); // ⬅️ NEW
app.use("/api/nextgen", nextGenRoutes);
app.use("/api/admin/nextgen", adminNextGenRoutes);
/* ── 404 ── */
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

/* ── Error handler ── */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);