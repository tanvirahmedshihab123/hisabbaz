const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // ═══ Clean filename — remove spaces & special chars ═══
    const baseName = file.originalname
      .replace(/\.pdf$/i, "")              // strip .pdf
      .replace(/[^a-zA-Z0-9-_]/g, "_")     // replace spaces/special with _
      .replace(/_+/g, "_")                 // collapse multiple _
      .slice(0, 60);                        // cap length

    return {
      folder: "hisabbazz/cvs",
      resource_type: "raw",                 // PDFs need "raw"
      format: "pdf",                        // ⬅️ FORCE .pdf extension
      public_id: `cv_${Date.now()}_${baseName}`,  // ⬅️ Cloudinary auto-appends .pdf
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;