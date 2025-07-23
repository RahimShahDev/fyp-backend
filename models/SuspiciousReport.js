const mongoose = require("mongoose");

const SuspiciousReportSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  vehicleType: {
    type: String,
    enum: [
      "Car",
      "Motorcycle",
      "Truck",
      "Bus",
      "Rickshaw",
      "SUV",
      "Van",
      "Tractor",
      "Trailer",
      "Other",
    ],
    required: true,
  },
  plateNumber: { type: String, required: true },
  locationSeen: { type: String, required: true },
  datetimeSeen: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Inspector" },
  firDetails: {
    description: String,
    dateFiled: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("SuspiciousReport", SuspiciousReportSchema);
