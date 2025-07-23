// // // routes/adminRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const Vehicle = require('../models/Vehicle');
// // const SuspiciousReport = require('../models/SuspiciousReport');
// // const verifyAdminToken = require('../middleware/verifyAdminToken');
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');
// // const csv = require('csv-parser');

// // const upload = multer({ dest: 'uploads/' });

// // // ✅ Secure all admin routes
// // router.use(verifyAdminToken);

// // // 📊 Dashboard Overview
// // router.get('/stats', async (req, res) => {
// //   try {
// //     const totalVehicles = await Vehicle.countDocuments();
// //     const totalFIRs = await Vehicle.countDocuments({ firDetails: { $ne: null } });
// //     const clearVehicles = totalVehicles - totalFIRs;

// //     res.json({ totalVehicles, totalFIRs, clearVehicles });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch dashboard stats' });
// //   }
// // });

// // // 🚗 Get All Vehicles
// // router.get('/vehicles', async (req, res) => {
// //   try {
// //     const vehicles = await Vehicle.find().sort({ createdAt: -1 });
// //     res.json(vehicles);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch vehicles' });
// //   }
// // });

// // // 🆕 Add New Vehicle
// // router.post('/add', async (req, res) => {
// //   const { plateNumber, chassisNumber, firDetails, firStatus } = req.body;

// //   try {
// //     const newVehicle = new Vehicle({ plateNumber, chassisNumber, firDetails, firStatus });
// //     const savedVehicle = await newVehicle.save();
// //     res.status(201).json({ message: 'Vehicle added', id: savedVehicle._id });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to add vehicle' });
// //   }
// // });

// // // ✏️ Update Vehicle by ID
// // router.put('/vehicle/:id', async (req, res) => {
// //   const { id } = req.params;
// //   const updates = req.body;

// //   try {
// //     const updated = await Vehicle.findByIdAndUpdate(id, updates, { new: true });
// //     res.json({ message: 'Vehicle updated', updated });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to update vehicle' });
// //   }
// // });

// // // ❌ Delete Vehicle by ID
// // router.delete('/vehicle/:id', async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     await Vehicle.findByIdAndDelete(id);
// //     res.json({ message: 'Vehicle deleted' });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to delete vehicle' });
// //   }
// // });

// // // 📤 Upload CSV
// // router.post('/upload-csv', upload.single('csv'), async (req, res) => {
// //   const filePath = path.join(__dirname, '..', req.file.path);
// //   const vehicles = [];

// //   try {
// //     fs.createReadStream(filePath)
// //       .pipe(csv())
// //       .on('data', (row) => {
// //         const { plateNumber, chassisNumber, firDetails, firStatus } = row;
// //         if (plateNumber && chassisNumber) {
// //           vehicles.push({ plateNumber, chassisNumber, firDetails, firStatus });
// //         }
// //       })
// //       .on('end', async () => {
// //         try {
// //           if (vehicles.length === 0) {
// //             res.status(400).json({ error: 'No valid data found in the CSV file' });
// //             fs.unlinkSync(filePath);
// //             return;
// //           }

// //           await Vehicle.insertMany(vehicles);
// //           fs.unlinkSync(filePath);
// //           res.status(200).json({ message: 'CSV uploaded and data stored successfully', count: vehicles.length });
// //         } catch (err) {
// //           console.error(err);
// //           res.status(500).json({ error: 'Error storing CSV data in MongoDB' });
// //         }
// //       });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to parse and process the CSV file' });
// //   }
// // });

// // // 🕵️ View all suspicious reports (new feature)
// // router.get('/suspicious-reports', async (req, res) => {
// //   try {
// //     const reports = await SuspiciousReport.find().sort({ createdAt: -1 });
// //     res.status(200).json({ reports });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch suspicious reports' });
// //   }
// // });

// // module.exports = router;




















// // // 📊 Report Stats: Total / Approved / Rejected / Pending
// // router.get('/report-stats', async (req, res) => {
// //   try {
// //     const total = await SuspiciousReport.countDocuments();
// //     const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
// //     const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
// //     const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

// //     res.status(200).json({ total, approved, rejected, pending });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch report stats' });
// //   }
// // });


// // // 📊 Report Stats: Total / Approved / Rejected / Pending
// // router.get('/report-stats', async (req, res) => {
// //   try {
// //     const total = await SuspiciousReport.countDocuments();
// //     const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
// //     const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
// //     const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

// //     res.status(200).json({ total, approved, rejected, pending });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch report stats' });
// //   }
// // });




// // const express = require('express');
// // const router = express.Router(); 
// // const fs = require('fs');
// // const path = require('path');
// // const csv = require('csv-parser');
// // const multer = require('multer');
// // const upload = multer({ dest: 'uploads/' });
// // const Vehicle = require('../models/Vehicle'); // Adjust the path as needed

// // // 📤 Upload CSV
// // router.post('/upload-csv', upload.single('csv'), async (req, res) => {
// //   const filePath = path.join(__dirname, '..', req.file.path);
// //   const vehicles = [];

// //   try {
// //     fs.createReadStream(filePath)
// //       .pipe(csv())
// //       .on('data', (row) => {
// //         const { plateNumber, chassisNumber, firDetails, firStatus } = row;
// //         if (plateNumber && chassisNumber) {
// //           vehicles.push({ plateNumber, chassisNumber, firDetails, firStatus });
// //         }
// //       })
// //       .on('end', async () => {
// //         try {
// //           if (vehicles.length === 0) {
// //             res.status(400).json({ error: 'No valid data found in the CSV file' });
// //             fs.unlinkSync(filePath);
// //             return;
// //           }

// //           await Vehicle.insertMany(vehicles);
// //           fs.unlinkSync(filePath);
// //           res.status(200).json({ message: 'CSV uploaded and data stored successfully', count: vehicles.length });
// //         } catch (err) {
// //           console.error(err);
// //           res.status(500).json({ error: 'Error storing CSV data in MongoDB' });
// //         }
// //       });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to parse and process the CSV file' });
// //   }
// // });










// const express = require("express");
// const router = express.Router();
// const csv = require("csv-parser");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const Vehicle = require("../models/Vehicle"); // ✅ Make sure this is correct

// const upload = multer({ dest: "uploads/" });

// // 📤 Upload CSV
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');
// const Vehicle = require('../models/Vehicle'); // adjust path to your model

// const upload = multer({ dest: 'uploads/' });

// const normalize = (str) =>
//   str.toLowerCase().replace(/[^a-z0-9]/g, ''); // normalize headers (e.g. 'Plate No.' → 'plateno')

// router.post('/upload-csv', upload.single('csv'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//   const filePath = path.join(__dirname, '..', req.file.path);
//   const vehicles = [];

//   try {
//     const headerMap = {
//       platenumber: 'plateNumber',
//       chassisnumber: 'chassisNumber',
//       firdetails: 'firDetails',
//       firstatus: 'firStatus',
//     };

//     fs.createReadStream(filePath)
//       .pipe(csv({ mapHeaders: ({ header }) => header && normalize(header) }))
//       .on('data', (row) => {
//         const normalized = {};
//         for (const key in row) {
//           const mapped = headerMap[key];
//           if (mapped) normalized[mapped] = row[key];
//         }

//         if (normalized.plateNumber && normalized.chassisNumber) {
//           vehicles.push(normalized);
//         }
//       })
//       .on('end', async () => {
//         try {
//           fs.unlinkSync(filePath); // delete temp file

//           if (vehicles.length === 0) {
//             return res
//               .status(400)
//               .json({ error: 'No valid data found in the CSV file' });
//           }

//           await Vehicle.insertMany(vehicles);
//           res.status(200).json({
//             message: 'CSV uploaded and data stored successfully',
//             count: vehicles.length,
//           });
//         } catch (err) {
//           console.error(err);
//           res.status(500).json({ error: 'Error storing CSV data in MongoDB' });
//         }
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to process the CSV file' });
//   }
// });








// // 📊 Report Stats: Total / Approved / Rejected / Pending
// router.get('/report-stats', async (req, res) => {
//   try {
//     const total = await SuspiciousReport.countDocuments();
//     const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
//     const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
//     const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

//     res.status(200).json({ total, approved, rejected, pending });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch report stats' });
//   }
// });



// module.exports = router;












// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const Vehicle = require('../models/Vehicle');
const SuspiciousReport = require('../models/SuspiciousReport');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const upload = multer({ dest: 'uploads/' });







// 📥 Download Sample CSV Template
router.get('/sample-csv-template', (req, res) => {
  const templatePath = path.join(__dirname, '../public/sample_template.csv');

  if (fs.existsSync(templatePath)) {
    res.download(templatePath, 'sample_vehicle_template.csv');
  } else {
    res.status(404).json({ error: 'Sample CSV template not found' });
  }
});


// ✅ Protect all admin routes
router.use(verifyAdminToken);





// 📤 Upload CSV (flexible header support)
router.post('/upload-csv', upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = path.join(__dirname, '..', req.file.path);
  const vehicles = [];

  // Normalize header names
  const normalize = (str) =>
    str?.toLowerCase().replace(/[^a-z0-9]/g, '');

  const headerMap = {
    platenumber: 'plateNumber',
    chassisnumber: 'chassisNumber',
    firdetails: 'firDetails',
    firstatus: 'firStatus',
  };

  try {
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => normalize(header) }))
      .on('data', (row) => {
        const normalized = {};
        for (const key in row) {
          const mapped = headerMap[key];
          if (mapped) normalized[mapped] = row[key];
        }

        if (normalized.plateNumber && normalized.chassisNumber) {
          vehicles.push(normalized);
        }
      })
      .on('end', async () => {
        try {
          fs.unlinkSync(filePath);
          if (vehicles.length === 0) {
            return res.status(400).json({ error: 'No valid data found in the CSV file' });
          }

          await Vehicle.insertMany(vehicles);
          res.status(200).json({
            message: 'CSV uploaded and data stored successfully',
            count: vehicles.length,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error storing CSV data in MongoDB' });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process the CSV file' });
  }
});

// 📊 Report Stats (Suspicious Reports)
router.get('/report-stats', async (req, res) => {
  try {
    const total = await SuspiciousReport.countDocuments();
    const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
    const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
    const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

    res.status(200).json({ total, approved, rejected, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report stats' });
  }
});

// 🚗 Get All Vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// ✅ Export the router only once at the end
module.exports = router;
