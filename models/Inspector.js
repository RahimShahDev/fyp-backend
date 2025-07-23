const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const inspectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  badgeId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

inspectorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Inspector', inspectorSchema);
