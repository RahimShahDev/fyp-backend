const express = require('express');
const router = express.Router();
const Inspector = require('../models/Inspector');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Inspector Registration
router.post('/register', async (req, res) => {
  const { name, email, badgeId, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existing = await Inspector.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Inspector already exists' });

    const newInspector = new Inspector({ name, email, badgeId, password });
    await newInspector.save();
    res.status(201).json({ message: 'Inspector registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 🔑 Inspector Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const inspector = await Inspector.findOne({ email });
//     if (!inspector) return res.status(400).json({ error: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, inspector.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: inspector._id, role: 'inspector' },
//       'inspector_secret_key',
//       { expiresIn: '1h' }
//     );

//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const inspector = await Inspector.findOne({ email });
    if (!inspector) {
      console.log("Inspector not found");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, inspector.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

   const token = jwt.sign(
  { id: inspector._id, role: "inspector" },
  "inspector_secret_key",
  { expiresIn: "1h" }
);


    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login error:", err);
    console.error("Inspector login ❌", err); 
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
