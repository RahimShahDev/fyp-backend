// // routes/admin.js
// const express = require('express');
// const router = express.Router();
// const  verifyToken  = require('../middleware/verifyAdminToken'); // adjust path if needed
// const Vehicle = require('../models/Vehicle'); // adjust path if needed
// const SuspiciousReport = require('../models/SuspiciousReport'); // adjust path if needed

// // Get vehicle stats
// // router.get('/stats', verifyToken, async (req, res) => {
// //   try {
// //     const totalVehicles = await Vehicle.countDocuments();
// //     const totalFIRs = await Vehicle.countDocuments({ firStatus: 'Approved' });
// //     const clearVehicles = await Vehicle.countDocuments({ firStatus: 'Clear' });
// //     const pendingVehicles = await Vehicle.countDocuments({ firStatus: 'Pending' });


// //     res.json({ totalVehicles, totalFIRs, clearVehicles, pendingFir: pendingVehicles });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });











// // GET /api/admin/report-stats
// router.get('/report-stats', verifyToken, async (req, res) => {
//   try {
//     const total = await SuspiciousReport.countDocuments();
//     const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
//     const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
//     const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

//     // Count by FIR category
//     const stolen = await SuspiciousReport.countDocuments({ category: 'Stolen' });
//     const fake = await SuspiciousReport.countDocuments({ category: 'Fake Registration' });
//     const wanted = await SuspiciousReport.countDocuments({ category: 'Wanted' });

//     // Weekly trend (past 7 days)
//     const allReports = await SuspiciousReport.find({
//       createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//     });

//     const daysMap = {
//       0: 'Sun',
//       1: 'Mon',
//       2: 'Tue',
//       3: 'Wed',
//       4: 'Thu',
//       5: 'Fri',
//       6: 'Sat'
//     };

//     const weeklyData = {};

//     allReports.forEach(report => {
//       const day = daysMap[new Date(report.createdAt).getDay()];
//       if (!weeklyData[day]) {
//         weeklyData[day] = { stolen: 0, fake: 0, wanted: 0 };
//       }

//       if (report.category === 'Stolen') weeklyData[day].stolen += 1;
//       if (report.category === 'Fake Registration') weeklyData[day].fake += 1;
//       if (report.category === 'Wanted') weeklyData[day].wanted += 1;
//     });

//     res.json({
//       total,
//       approved,
//       rejected,
//       pending,
//       stolen,
//       fake,
//       wanted,
//       weeklyData
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




// // Get suspicious report stats
// router.get('/report-stats', verifyToken, async (req, res) => {
//   try {
//     const total = await SuspiciousReport.countDocuments();
//     const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
//     const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
//     const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

//     res.json({ total, approved, rejected, pending });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // GET all vehicles
// router.get('/vehicles', verifyToken, async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find();
//     res.json(vehicles);
//   } catch (err) {
//     console.error("Error fetching vehicles:", err);
//     res.status(500).json({ error: "Failed to fetch vehicles" });
//   }
// });


// // PUT update vehicle
// router.put('/vehicle/:id', verifyToken, async (req, res) => {
//   const { id } = req.params;
//   const { plateNumber, chassisNumber, firStatus, firDetails } = req.body;

//   try {
//     const updated = await Vehicle.findByIdAndUpdate(
//       id,
//       { plateNumber, chassisNumber, firStatus, firDetails },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ error: 'Vehicle not found' });

//     res.json({ message: 'Vehicle updated successfully', vehicle: updated });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({ error: 'Failed to update vehicle' });
//   }
// });


// // DELETE vehicle
// router.delete('/vehicle/:id', verifyToken, async (req, res) => {
//   try {
//     const result = await Vehicle.findByIdAndDelete(req.params.id);
//     if (!result) return res.status(404).json({ error: "Vehicle not found" });
//     res.json({ message: "Vehicle deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({ error: "Failed to delete vehicle" });
//   }
// });
// // POST add a new vehicle
// router.post('/add', verifyToken, async (req, res) => {
//   const { plateNumber, chassisNumber, firStatus, firDetails } = req.body;

//   try {
//     const newVehicle = new Vehicle({
//       plateNumber,
//       chassisNumber,
//       firStatus,
//       firDetails
//     });

//     await newVehicle.save();

//     res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
//   } catch (error) {
//     console.error('Add vehicle error:', error);
//     res.status(500).json({ error: 'Failed to add vehicle' });
//   }
// });


// module.exports = router;




// routes/admin.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyAdminToken');
const Vehicle = require('../models/Vehicle');
const SuspiciousReport = require('../models/SuspiciousReport');

// Get vehicle stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalFIRs = await Vehicle.countDocuments({ firStatus: 'Approved' });
    const clearVehicles = await Vehicle.countDocuments({ firStatus: 'Clear' });
    const pendingVehicles = await Vehicle.countDocuments({ firStatus: 'Pending' });

    res.json({ totalVehicles, totalFIRs, clearVehicles, pendingFir: pendingVehicles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/report-stats
router.get('/report-stats', verifyToken, async (req, res) => {
  try {
    const total = await SuspiciousReport.countDocuments();
    const approved = await SuspiciousReport.countDocuments({ status: 'Approved' });
    const rejected = await SuspiciousReport.countDocuments({ status: 'Rejected' });
    const pending = await SuspiciousReport.countDocuments({ status: 'Pending' });

    const stolen = await SuspiciousReport.countDocuments({ category: 'Stolen' });
    const fake = await SuspiciousReport.countDocuments({ category: 'Fake Registration' });
    const wanted = await SuspiciousReport.countDocuments({ category: 'Wanted' });

    const allReports = await SuspiciousReport.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const daysMap = {
      0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
    };

    const weeklyData = {};
    allReports.forEach(report => {
      const day = daysMap[new Date(report.createdAt).getDay()];
      if (!weeklyData[day]) {
        weeklyData[day] = { stolen: 0, fake: 0, wanted: 0 };
      }
      if (report.category === 'Stolen') weeklyData[day].stolen += 1;
      if (report.category === 'Fake Registration') weeklyData[day].fake += 1;
      if (report.category === 'Wanted') weeklyData[day].wanted += 1;
    });

    res.json({
      total,
      approved,
      rejected,
      pending,
      stolen,
      fake,
      wanted,
      weeklyData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all vehicles
router.get('/vehicles', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// PUT update vehicle
router.put('/vehicle/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { plateNumber, chassisNumber, firStatus, firDetails } = req.body;

  try {
    const updated = await Vehicle.findByIdAndUpdate(
      id,
      { plateNumber, chassisNumber, firStatus, firDetails },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });

    res.json({ message: 'Vehicle updated successfully', vehicle: updated });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// DELETE vehicle
router.delete('/vehicle/:id', verifyToken, async (req, res) => {
  try {
    const result = await Vehicle.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});

// POST add a new vehicle
router.post('/add', verifyToken, async (req, res) => {
  const { plateNumber, chassisNumber, firStatus, firDetails } = req.body;

  try {
    const newVehicle = new Vehicle({
      plateNumber,
      chassisNumber,
      firStatus,
      firDetails
    });

    await newVehicle.save();

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

module.exports = router;
