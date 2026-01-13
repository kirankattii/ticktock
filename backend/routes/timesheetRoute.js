const express = require("express");
const router = express.Router();
const {
  createOrGetWeeklyTimesheet,
  getAllWeeklyTimesheets,
  getWeeklyTimesheet,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
} = require("../controllers/TimesheetController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Create or get weekly timesheet
router.post("/", createOrGetWeeklyTimesheet);

// Get all weekly timesheets for the user
router.get("/", getAllWeeklyTimesheets);

// Get a specific weekly timesheet
router.get("/:id", getWeeklyTimesheet);

// Add a daily task to weekly timesheet
router.post("/:id/task", addDailyTask);

// Update a daily task
router.put("/:id/task/:taskId", updateDailyTask);

// Delete a daily task
router.delete("/:id/task/:taskId", deleteDailyTask);

module.exports = router;
