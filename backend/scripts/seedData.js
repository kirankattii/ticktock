const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const WeeklyTimesheet = require("../models/WeeklyTimesheet");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await WeeklyTimesheet.deleteMany({});
    // Uncomment below if you want to clear users too
    // await User.deleteMany({});

    // Create or get a test user
    let testUser = await User.findOne({ email: "test@example.com" });
    
    if (!testUser) {
      console.log("Creating test user...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });
      console.log("Test user created:", testUser.email);
    } else {
      console.log("Using existing test user:", testUser.email);
    }

    // Get current date and calculate week ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Helper function to get Monday of a week
    const getMonday = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Monday is day 1, Sunday is day 0
      const monday = new Date(d);
      monday.setDate(d.getDate() + diff);
      return monday;
    };

    // Create timesheets for the last 4 weeks and current week
    const timesheets = [];
    
    for (let weekOffset = -4; weekOffset <= 0; weekOffset++) {
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() + (weekOffset * 7));
      
      const monday = getMonday(weekDate);
      monday.setHours(0, 0, 0, 0);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // Check if timesheet already exists
      let timesheet = await WeeklyTimesheet.findOne({
        user: testUser._id,
        weekStartDate: monday,
        weekEndDate: sunday,
      });

      if (!timesheet) {
        timesheet = await WeeklyTimesheet.create({
          user: testUser._id,
          weekStartDate: monday,
          weekEndDate: sunday,
          dailyTasks: [],
        });
      }

      // Add daily tasks for this week (Monday to Friday)
      const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Website Redesign"];
      const workTypes = ["Development", "Bug fixes", "Code review", "Testing", "Documentation", "Meeting"];
      const taskDescriptions = [
        "Implemented user authentication module",
        "Fixed login validation bug",
        "Reviewed pull request #123",
        "Wrote unit tests for API endpoints",
        "Updated project documentation",
        "Attended sprint planning meeting",
        "Optimized database queries",
        "Fixed responsive design issues",
        "Added new feature: dark mode",
        "Resolved merge conflicts",
      ];

      // Add 2-4 tasks per day for Monday to Friday
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const taskDate = new Date(monday);
        taskDate.setDate(monday.getDate() + dayOffset);
        
        const numTasks = Math.floor(Math.random() * 3) + 2; // 2-4 tasks per day
        
        for (let i = 0; i < numTasks; i++) {
          const project = projects[Math.floor(Math.random() * projects.length)];
          const workType = workTypes[Math.floor(Math.random() * workTypes.length)];
          const description = taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)];
          const hours = Math.floor(Math.random() * 4) + 2; // 2-5 hours per task

          // Check if task already exists for this date
          const existingTask = timesheet.dailyTasks.find(
            (task) => new Date(task.date).toDateString() === taskDate.toDateString() &&
            task.description === description
          );

          if (!existingTask) {
            timesheet.dailyTasks.push({
              date: taskDate,
              project: project,
              typeOfWork: workType,
              description: description,
              hours: hours,
            });
          }
        }
      }

      await timesheet.save();
      timesheets.push(timesheet);
      console.log(`Created/Updated timesheet for week ${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`);
    }

    console.log("\n✅ Seed data created successfully!");
    console.log(`📊 Created ${timesheets.length} weekly timesheets`);
    console.log(`👤 Test user: ${testUser.email} / password: password123`);
    console.log(`📝 Total tasks created: ${timesheets.reduce((sum, ts) => sum + ts.dailyTasks.length, 0)}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
