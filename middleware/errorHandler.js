const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found";
  }
  // Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(", ")}`;
  }
  // Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;