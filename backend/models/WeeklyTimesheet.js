const mongoose = require("mongoose");
const dailyTaskSchema = require("./DailyTask");

const weeklyTimesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  weekStartDate: {
    type: Date,
    required: [true, "Week start date is required"],
  },
  weekEndDate: {
    type: Date,
    required: [true, "Week end date is required"],
  },
  dailyTasks: [dailyTaskSchema],
}, {
  timestamps: true,
});

// Index for efficient queries
weeklyTimesheetSchema.index({ user: 1, weekStartDate: 1, weekEndDate: 1 });

// Virtual for total hours in the week
weeklyTimesheetSchema.virtual("totalHours").get(function() {
  return this.dailyTasks.reduce((total, task) => total + (task.hours || 0), 0);
});

// Include virtuals in JSON output
weeklyTimesheetSchema.set("toJSON", { virtuals: true });
weeklyTimesheetSchema.set("toObject", { virtuals: true });

const WeeklyTimesheet = mongoose.model("WeeklyTimesheet", weeklyTimesheetSchema);

module.exports = WeeklyTimesheet;
