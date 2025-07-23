
//const mongoose = require('mongoose');
//
//const vehicleSchema = new mongoose.Schema({
  //plateNumber: String,
  //chassisNumber: String,
  //owner: String,         // Example extra field
  //registrationDate: String, // Another extra field
//});

//module.exports = mongoose.model('Vehicle', vehicleSchema);
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: String,
  chassisNumber: String,
  owner: String,             // Optional
  registrationDate: String, // Optional
  firDetails: String,        // Optional - keep existing FIR data
  firStatus: {
    type: String,
    enum: ["No", "Yes", "Pending"],
    default: "No"
  }
});


module.exports = mongoose.model('Vehicle', vehicleSchema);
