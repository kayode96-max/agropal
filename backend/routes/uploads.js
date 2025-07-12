const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Configure multer for general file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.params.type || "general";
    const uploadDir = `uploads/${uploadType}`;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file types based on upload type
    const uploadType = req.params.type || "general";
    let allowedTypes;

    switch (uploadType) {
      case "images":
        allowedTypes = /jpeg|jpg|png|gif|webp/;
        break;
      case "documents":
        allowedTypes = /pdf|doc|docx|txt/;
        break;
      case "audio":
        allowedTypes = /mp3|wav|m4a|ogg/;
        break;
      case "video":
        allowedTypes = /mp4|avi|mov|wmv|webm/;
        break;
      default:
        allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|mp3|wav|mp4/;
    }

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error(`Only ${uploadType} files are allowed`));
    }
  },
});

// POST /api/uploads/:type - Upload files of specific type
router.post("/:type", upload.array("files", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/api/uploads/serve/${req.params.type}/${file.filename}`,
      uploadedAt: new Date().toISOString(),
    }));

    res.json({
      success: true,
      message: `${req.files.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to upload files",
      message: error.message,
    });
  }
});

// GET /api/uploads/serve/:type/:filename - Serve uploaded files
router.get("/serve/:type/:filename", (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, "..", "uploads", type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileExtension = path.extname(filename).toLowerCase();

    // Set appropriate content type
    let contentType = "application/octet-stream";
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(fileExtension)) {
      contentType = `image/${fileExtension.slice(1)}`;
    } else if ([".mp3", ".wav", ".m4a", ".ogg"].includes(fileExtension)) {
      contentType = `audio/${fileExtension.slice(1)}`;
    } else if ([".mp4", ".avi", ".mov", ".webm"].includes(fileExtension)) {
      contentType = `video/${fileExtension.slice(1)}`;
    } else if (fileExtension === ".pdf") {
      contentType = "application/pdf";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    // Stream the file
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error) {
    console.error("File serve error:", error);
    res.status(500).json({
      error: "Failed to serve file",
      message: error.message,
    });
  }
});

// DELETE /api/uploads/:type/:filename - Delete uploaded file
router.delete("/:type/:filename", (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, "..", "uploads", type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File delete error:", error);
    res.status(500).json({
      error: "Failed to delete file",
      message: error.message,
    });
  }
});

// GET /api/uploads/:type - List files of specific type
router.get("/:type", (req, res) => {
  try {
    const { type } = req.params;
    const uploadDir = path.join(__dirname, "..", "uploads", type);

    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        files: [],
        total: 0,
      });
    }

    const files = fs.readdirSync(uploadDir).map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
        url: `/api/uploads/serve/${type}/${filename}`,
      };
    });

    // Sort by creation date (newest first)
    files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      files,
      total: files.length,
    });
  } catch (error) {
    console.error("List files error:", error);
    res.status(500).json({
      error: "Failed to list files",
      message: error.message,
    });
  }
});

module.exports = router;
