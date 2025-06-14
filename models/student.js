const mongoose = require("mongoose");

  const StudentSchema = mongoose.Schema({
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      // match: /^[0-9]{10}$/
    },
    branch: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    Xyear: {
      type: String,
      default: "0",
    },
    Xmarks: {
      type: String,
      default: "0%",
    },
    XIIyear: {
      type: String,
      default: "0",
    },
    XIImarks: {
      type: String,
      default: "0%",
    },
    resume: {
      type: String,
      default: null,
    },
    college: {
      type: String,
      default: "mpct",
    },
    placedCompany: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "student",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });

  const StudentModel = mongoose.model("student", StudentSchema);

  module.exports = StudentModel;