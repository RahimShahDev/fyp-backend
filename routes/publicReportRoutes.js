// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const SuspiciousReport = require('../models/SuspiciousReport');

// const router = express.Router();

// // Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/reports/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// // 🚨 POST /api/public/report-suspicious
// router.post('/report-suspicious', upload.single('image'), async (req, res) => {
//   const {
//     fullName,
//     email,
//     vehicleType,
//     plateNumber,
//     locationSeen,
//     datetimeSeen,
//     description
//   } = req.body;

//   const imageUrl = req.file ? `/uploads/reports/${req.file.filename}` : null;

//   try {
//     const newReport = new SuspiciousReport({
//       fullName,
//       email,
//       vehicleType,
//       plateNumber,
//       locationSeen,
//       datetimeSeen,
//       description,
//       imageUrl
//     });

//     await newReport.save();
//     res.status(201).json({ message: 'Suspicious vehicle report submitted', report: newReport });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to submit report' });
//   }
// });

// module.exports = router;







const express = require("express");
const multer  = require("multer");
const path    = require("path");
const SuspiciousReport = require("../models/SuspiciousReport");

const router = express.Router();

// make sure this directory exists
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/reports"),
  filename:    (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/public/report-suspicious
router.post("/report-suspicious", upload.single("image"), async (req, res) => {
  try {
    const { fullName, email, vehicleType, plateNumber, locationSeen, datetimeSeen, description } = req.body;
    const imageUrl = req.file ? `/uploads/reports/${req.file.filename}` : null;

    const newReport = new SuspiciousReport({
      fullName,
      email,
      vehicleType,
      plateNumber,
      locationSeen,
      datetimeSeen,
      description,
      imageUrl,
    });

    await newReport.save();
    return res.status(201).json({ message: "Suspicious vehicle report submitted", report: newReport });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ error: err.message || "Failed to submit report" });
  }
});

module.exports = router;
