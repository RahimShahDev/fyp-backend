const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Routes
// routes
const publicRoutes = require("./routes/publicReportRoutes");
const searchRoute = require('./routes/searchRoute');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const contactRoutes = require('./routes/contactRoutes'); // <-- add this at the top
const adminRoutes = require('./routes/adminRoutes');
const inspectorAuthRoutes = require('./routes/inspectorAuthRoutes');
// const publicRoutes = require('./routes/publicReportRoutes')
const inspectorRoutes = require('./routes/inspectorRoutes');
const printFIRRoutes = require('./routes/printFIRRoutes');

// Models
const User = require('./models/User');  
const Vehicle = require('./models/Vehicle');

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cors());
// app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/admin', adminAuthRoutes);
// app.use('/api', contactRoutes); // <-- add this before app.listen()
app.use('/api',        contactRoutes);   
app.use('/api', printFIRRoutes);
// app.use("/api/public", publicRoutes);
app.use('/api/inspector', inspectorAuthRoutes);
app.use('/api/public', publicRoutes);
app.use('/uploads', express.static('uploads')); // to serve uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/inspector', inspectorRoutes); 
app.use('/api', printFIRRoutes);
app.use("/api/public", publicRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', adminRoutes);




// MongoDB (Mongoose) connection
mongoose.connect('mongodb+srv://FYP:7lw5tClklkFxzza2@cluster0.zzzyvto.mongodb.net/vehicleFIR', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas with Mongoose");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// 👇 Use external routes for upload and search

app.use('/api', searchRoute);

// Default test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//
// 🔐 REGISTER Route
//
app.post('/api/register', async (req, res) => {
  const { username, email, cnic, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { cnic }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, cnic, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//
// 🔑 LOGIN Route
//
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'your_secret_key', {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});


//
// 🔍 SEARCH Vehicle FIR
//
app.post('/api/search', async (req, res) => {
  const { plateNumber, chassisNumber } = req.body;
  try {
    const result = await Vehicle.findOne({
      $or: [{ plateNumber }, { chassisNumber }]
    });

    if (result) {
      res.json({ found: true, data: result });
    } else {
      res.json({ found: false, message: 'No FIR found for this vehicle.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/api/admin', adminRoutes);


//
// ➕ Add Sample Data Route
//
// app.post('/api/add', async (req, res) => {
//   const { plateNumber, chassisNumber, firDetails } = req.body;
//   try {
//     const newVehicle = new Vehicle({ plateNumber, chassisNumber, firDetails });
//     const savedVehicle = await newVehicle.save();
//     res.json({ message: 'Vehicle FIR added', id: savedVehicle._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add FIR' });
//   }
// });

//
// Start the server
//
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
