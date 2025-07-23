// routes/inspectorRoutes.js
const express = require('express');
const router = express.Router();
const SuspiciousReport = require('../models/SuspiciousReport');
const Vehicle = require('../models/Vehicle');
const verifyInspectorToken = require('../middleware/verifyInspectorToken');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// 🔒 Middleware to protect routes
router.use(verifyInspectorToken);

// 1. 📋 View All Suspicious Reports
router.get('/suspicious-reports', async (req, res) => {
  try {
    const reports = await SuspiciousReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// 2. ✅ Approve / ❌ Reject Suspicious Report
router.put('/suspicious-reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updatedReport = await SuspiciousReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ message: `Report ${status.toLowerCase()}`, report: updatedReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

// 3. 🚔 Add FIR to a Vehicle
// router.post('/add-fir', async (req, res) => {
//   const { plateNumber, chassisNumber, firDetails } = req.body;

//   if (!plateNumber && !chassisNumber) {
//     return res.status(400).json({ error: 'Plate number or chassis number is required' });
//   }

//   try {
//     const updatedVehicle = await Vehicle.findOneAndUpdate(
//       { $or: [{ plateNumber }, { chassisNumber }] },
//       { firDetails, firStatus: 'Yes' },
//       { new: true, upsert: true }
//     );

//     res.json({ message: 'FIR added to vehicle', vehicle: updatedVehicle });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add FIR' });
//   }
// });
router.post('/add-fir', async (req, res) => {
  const { plateNumber, chassisNumber, firDetails, firStatus } = req.body;

  if (!plateNumber && !chassisNumber) {
    return res.status(400).json({ error: 'Plate number or chassis number is required' });
  }

  // ✅ Validate firStatus to allow only expected values
  if (!['Approved', 'Clear', 'Pending'].includes(firStatus)) {
    return res.status(400).json({ error: 'Invalid FIR status' });
  }

  try {
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { $or: [{ plateNumber }, { chassisNumber }] },
      { firDetails, firStatus },
      { new: true, upsert: true }
    );

    res.json({ message: 'FIR added to vehicle', vehicle: updatedVehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add FIR' });
  }
});


// 4. 📊 FIR-related Analytics
router.get('/fir-analytics', async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const firApproved = await Vehicle.countDocuments({ firStatus: 'Approved' });
    const firPending = await Vehicle.countDocuments({ firStatus: 'Pending' });
    const firClear = await Vehicle.countDocuments({ firStatus: 'Clear' });
    
    res.json({
      totalVehicles,
      firCases: firApproved + firPending + firClear,
      approved: firApproved,
      pending: firPending,
      clear: firClear,
      nonFir: totalVehicles - (firApproved + firPending + firClear),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});


// 5. 📥 Download FIRs by Status (Approved, Rejected, Pending)
router.get('/download-firs/:status', async (req, res) => {
  const { status } = req.params;
  const validStatuses = ['Approved', 'Rejected', 'Pending'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status type' });
  }

  try {
    const reports = await SuspiciousReport.find({ status }).sort({ createdAt: -1 });
    if (!reports.length) {
      return res.status(404).json({ message: `No ${status} FIRs found` });
    }

    const fields = [
      { label: 'FIR ID', value: '_id' },
      { label: 'Full Name', value: 'fullName' },
      { label: 'Email', value: 'email' },
      { label: 'Vehicle Type', value: 'vehicleType' },
      { label: 'Plate Number', value: 'plateNumber' },
      { label: 'Location Seen', value: 'locationSeen' },
      { label: 'Date/Time Seen', value: row => new Date(row.datetimeSeen).toLocaleString() },
      { label: 'Description', value: 'description' },
      { label: 'Status', value: 'status' },
      { label: 'Submitted At', value: row => new Date(row.createdAt).toLocaleString() }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(reports);
    const filePath = path.join(__dirname, `../public/firs_${status.toLowerCase()}.csv`);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, `FIRs_${status}.csv`, () => {
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to generate ${status} FIR CSV` });
  }
});

// 6. 📅 Filter FIRs by Date and Location
router.get('/filter-firs', async (req, res) => {
  const { startDate, endDate, location } = req.query;
  const filter = {};

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (location) {
    filter.locationSeen = new RegExp(location, 'i'); // case-insensitive match
  }

  try {
    const reports = await SuspiciousReport.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to filter FIRs' });
  }
});

module.exports = router;
