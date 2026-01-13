const WeeklyTimesheet = require("../models/WeeklyTimesheet");

// Create or get weekly timesheet
const createOrGetWeeklyTimesheet = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate } = req.body;
    const userId = req.user.id;

    // Validation
    if (!weekStartDate || !weekEndDate) {
      return res.status(400).json({ message: "Week start date and end date are required" });
    }

    const startDate = new Date(weekStartDate);
    const endDate = new Date(weekEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (startDate > endDate) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    // Check if timesheet already exists for this week
    const existingTimesheet = await WeeklyTimesheet.findOne({
      user: userId,
      weekStartDate: startDate,
      weekEndDate: endDate,
    });

    if (existingTimesheet) {
      return res.status(400).json({
        message: "A timesheet for this week already exists",
      });
    }

    // Create new timesheet
    timesheet = await WeeklyTimesheet.create({
      user: userId,
      weekStartDate: startDate,
      weekEndDate: endDate,
      dailyTasks: [],
    });

    res.status(201).json({
      message: "Weekly timesheet created successfully",
      timesheet: {
        _id: timesheet._id,
        weekStartDate: timesheet.weekStartDate,
        weekEndDate: timesheet.weekEndDate,
        dailyTasks: timesheet.dailyTasks,
        totalHours: timesheet.totalHours,
        createdAt: timesheet.createdAt,
        updatedAt: timesheet.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get all weekly timesheets for the user
const getAllWeeklyTimesheets = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get pagination parameters from query string
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    
    // Validate and set defaults
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    
    // Get total count for pagination metadata
    const totalCount = await WeeklyTimesheet.countDocuments({ user: userId });
    
    // Calculate total pages
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 1;
    
    // Validate page number - if page exceeds total pages, set to last page
    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }
    
    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch timesheets with pagination
    const timesheets = await WeeklyTimesheet.find({ user: userId })
      .sort({ weekStartDate: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    res.status(200).json({
      message: "Weekly timesheets retrieved successfully",
      timesheets: timesheets.map((ts) => ({
        _id: ts._id,
        weekStartDate: ts.weekStartDate,
        weekEndDate: ts.weekEndDate,
        dailyTasks: ts.dailyTasks,
        totalHours: ts.totalHours,
        createdAt: ts.createdAt,
        updatedAt: ts.updatedAt,
      })),
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get a specific weekly timesheet
const getWeeklyTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const timesheet = await WeeklyTimesheet.findOne({
      _id: id,
      user: userId,
    });

    if (!timesheet) {
      return res.status(404).json({ message: "Weekly timesheet not found" });
    }

    res.status(200).json({
      message: "Weekly timesheet retrieved successfully",
      timesheet: {
        _id: timesheet._id,
        weekStartDate: timesheet.weekStartDate,
        weekEndDate: timesheet.weekEndDate,
        dailyTasks: timesheet.dailyTasks,
        totalHours: timesheet.totalHours,
        createdAt: timesheet.createdAt,
        updatedAt: timesheet.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid timesheet ID" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Add a daily task to weekly timesheet
const addDailyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, project, typeOfWork, description, hours } = req.body;
    const userId = req.user.id;

    // Validation
    if (!date || !project || !typeOfWork || !description || hours === undefined) {
      return res.status(400).json({
        message: "Date, project, type of work, description, and hours are required",
      });
    }

    if (typeof hours !== "number" || hours < 0 || hours > 24) {
      return res.status(400).json({
        message: "Hours must be a number between 0 and 24",
      });
    }

    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Find the timesheet
    const timesheet = await WeeklyTimesheet.findOne({
      _id: id,
      user: userId,
    });

    if (!timesheet) {
      return res.status(404).json({ message: "Weekly timesheet not found" });
    }

    // Create new task
    const newTask = {
      date: taskDate,
      project: project.trim(),
      typeOfWork: typeOfWork.trim(),
      description: description.trim(),
      hours: hours,
    };

    timesheet.dailyTasks.push(newTask);
    await timesheet.save();

    const addedTask = timesheet.dailyTasks[timesheet.dailyTasks.length - 1];

    res.status(201).json({
      message: "Daily task added successfully",
      task: addedTask,
      timesheet: {
        _id: timesheet._id,
        totalHours: timesheet.totalHours,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid timesheet ID" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Update a daily task
const updateDailyTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { date, project, typeOfWork, description, hours } = req.body;
    const userId = req.user.id;

    // Validation
    if (hours !== undefined && (typeof hours !== "number" || hours < 0 || hours > 24)) {
      return res.status(400).json({
        message: "Hours must be a number between 0 and 24",
      });
    }

    // Find the timesheet
    const timesheet = await WeeklyTimesheet.findOne({
      _id: id,
      user: userId,
    });

    if (!timesheet) {
      return res.status(404).json({ message: "Weekly timesheet not found" });
    }

    // Find the task
    const task = timesheet.dailyTasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Daily task not found" });
    }

    // Update task fields
    if (date !== undefined) {
      const taskDate = new Date(date);
      if (isNaN(taskDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      task.date = taskDate;
    }
    if (project !== undefined) task.project = project.trim();
    if (typeOfWork !== undefined) task.typeOfWork = typeOfWork.trim();
    if (description !== undefined) task.description = description.trim();
    if (hours !== undefined) task.hours = hours;

    await timesheet.save();

    res.status(200).json({
      message: "Daily task updated successfully",
      task: task,
      timesheet: {
        _id: timesheet._id,
        totalHours: timesheet.totalHours,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid timesheet ID or task ID" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Delete a daily task
const deleteDailyTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const userId = req.user.id;

    // Find the timesheet
    const timesheet = await WeeklyTimesheet.findOne({
      _id: id,
      user: userId,
    });

    if (!timesheet) {
      return res.status(404).json({ message: "Weekly timesheet not found" });
    }

    // Find and remove the task
    const task = timesheet.dailyTasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Daily task not found" });
    }

    task.deleteOne();
    await timesheet.save();

    res.status(200).json({
      message: "Daily task deleted successfully",
      timesheet: {
        _id: timesheet._id,
        totalHours: timesheet.totalHours,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid timesheet ID or task ID" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createOrGetWeeklyTimesheet,
  getAllWeeklyTimesheets,
  getWeeklyTimesheet,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
};
