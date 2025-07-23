const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Search using both fields strictly
router.post('/search', async (req, res) => {
  const { plateNumber, chassisNumber } = req.body;

  // Ensure both values are provided
  if (!plateNumber || !chassisNumber) {
    return res.status(400).json({ error: 'Both plateNumber and chassisNumber are required' });
  }

  try {
    const result = await Vehicle.findOne({
      plateNumber: plateNumber,
      chassisNumber: chassisNumber
    });

    if (result) {
      res.json({ found: true, data: result });
    } else {
      res.json({ found: false, message: 'No record found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
