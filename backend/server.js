import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Intern Management API Running...");
});

import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/admin", adminRoutes);
import internRoutes from "./routes/internRoutes.js";
app.use("/api/interns", internRoutes);
import projectRoutes from "./routes/projectRoutes.js";
app.use("/api/projects", projectRoutes);

import taskRoutes from "./routes/taskRoutes.js";
app.use("/api/tasks", taskRoutes);
import examRoutes from "./routes/examRoutes.js";
app.use("/api/exams", examRoutes);
import internAuthRoutes from "./routes/internAuthRoutes.js";
app.use("/api/intern/auth", internAuthRoutes);

import internRoutes1 from "./routes/internRoutes1.js";
app.use("/api/intern", internRoutes1);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
