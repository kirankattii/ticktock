const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  project: {
    type: String,
    required: [true, "Project is required"],
    trim: true,
  },
  typeOfWork: {
    type: String,
    required: [true, "Type of work is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Task description is required"],
    trim: true,
  },
  hours: {
    type: Number,
    required: [true, "Hours is required"],
    min: [0, "Hours cannot be negative"],
    max: [24, "Hours cannot exceed 24"],
  },
}, {
  timestamps: true,
});

module.exports = dailyTaskSchema;
