const mongoose = require("mongoose");
const dotenv = require("dotenv");
const WeeklyTimesheet = require("../models/WeeklyTimesheet");
const User = require("../models/User");

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

const clearData = async () => {
  try {
    await connectDB();

    console.log("Clearing all timesheet data...");
    
    // Delete all weekly timesheets (this will also delete all daily tasks)
    const result = await WeeklyTimesheet.deleteMany({});
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} weekly timesheet(s)`);
    console.log("📝 All daily tasks have been deleted as well");
    
    // Optionally clear user tokens (uncomment if needed)
    // await User.updateMany({}, { $set: { token: null } });
    // console.log("🔑 User tokens cleared");
    
    process.exit(0);
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
};

clearData();
