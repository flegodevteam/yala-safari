// filepath: c:\Users\imran\OneDrive\Desktop\yala\sample\yala-safari\backend\models\Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);