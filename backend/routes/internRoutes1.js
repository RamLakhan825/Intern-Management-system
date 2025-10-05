import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Resource from "../models/Resource.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Exam from "../models/Exam.js";

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // Replace with process.env.JWT_SECRET in production

// ------------------ Middleware ------------------
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.internId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------ ROUTES ------------------

// Get assigned tasks
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const internObjectId = new mongoose.Types.ObjectId(req.internId);
    const tasks = await Task.find({ assignedTo: { $in: [internObjectId] } })
      .populate("assignedTo", "name email skills");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Mark task complete
router.put("/tasks/:taskId/complete", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const internId = req.internId;

    const task = await Task.findOne({ _id: taskId, assignedTo: internId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "completed";
    await task.save();
    await task.populate("assignedTo", "name email skills");

    res.json(task);
  } catch (err) {
    console.error("Error marking task complete:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get assigned projects with tasks
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const internObjectId = new mongoose.Types.ObjectId(req.internId);
    const projects = await Project.find({ interns: { $in: [internObjectId] } })
      .populate("interns", "name email");

    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({
          _id: { $in: project.tasks },
          assignedTo: { $in: [internObjectId] },
        }).populate("assignedTo", "name email skills");

        return { ...project.toObject(), tasks };
      })
    );

    res.json(projectsWithTasks);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all assigned exams
router.get("/exams", authMiddleware, async (req, res) => {
  try {
    const internObjectId = new mongoose.Types.ObjectId(req.internId);
    const exams = await Exam.find({ assignedTo: { $in: [internObjectId] } })
      .populate("assignedTo", "name email");
    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get a single exam
router.get("/exams/:examId", authMiddleware, async (req, res) => {
  try {
    const { examId } = req.params;
    const internObjectId = new mongoose.Types.ObjectId(req.internId);

    const exam = await Exam.findOne({
      _id: examId,
      assignedTo: { $in: [internObjectId] },
    });

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (error) {
    console.error("Error fetching single exam:", error.message);
    res.status(500).json({ message: "Failed to load exam" });
  }
});

// Submit exam answers
router.post("/exams/:examId/submit", authMiddleware, async (req, res) => {
  const { answers } = req.body;
  const internId = req.internId;

  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Ensure exam.scores exists
    exam.scores = exam.scores || [];

    // Check if intern already submitted
    const alreadySubmitted = exam.scores.some(
      (s) => s.intern && s.intern.toString() === internId
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted this exam" });
    }

    // Calculate score
    let score = 0;
    answers.forEach((a) => {
      if (exam.questions[a.questionIndex]?.answer === a.answer) score += 1;
    });

    // Correct way to create ObjectId
    exam.scores.push({ intern: new mongoose.Types.ObjectId(internId), score });
    await exam.save();

    res.json({ message: "Exam submitted successfully", score });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ message: error.message });
  }
});


router.get("/resources", authMiddleware, async (req, res) => {
  try {
    const internObjectId = new mongoose.Types.ObjectId(req.internId);
    const resources = await Resource.find({ assignedTo: { $in: [internObjectId] } });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
