const mongoose = require("mongoose");

const adminDetails = new mongoose.Schema({
  employeeId: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Admin Detail", adminDetails);
