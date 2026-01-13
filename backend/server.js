const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute");
const timesheetRoute = require("./routes/timesheetRoute");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./database/db");
dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/timesheet", timesheetRoute);
app.use(express.urlencoded({ extended: true }));

connectDB();
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
