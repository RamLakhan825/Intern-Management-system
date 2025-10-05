import express from "express";
import mongoose from "mongoose"; // ⚠ Make sure mongoose is imported here
import Task from "../models/Task.js";
import Intern from "../models/Intern.js";
import Project from "../models/Project.js";

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email skills");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Add new task
router.post("/", async (req, res) => {
  const { title, description, assignedTo, dueDate, projectId } = req.body;
  try {
    const interns = await Intern.find({ _id: { $in: assignedTo } });
    if (interns.length === 0)
      return res.status(404).json({ message: "No valid interns selected" });

    // Convert IDs to ObjectId
    const assignedObjectIds = assignedTo.map(id => new mongoose.Types.ObjectId(id));

    // Debug log
    console.log("Creating task for interns:", assignedObjectIds);

    const task = await Task.create({ title, description, assignedTo: assignedObjectIds, dueDate });

    // Add task to interns
    for (let intern of interns) {
      intern.assignedTasks.push(task._id);
      await intern.save();
      console.log(`Added task ${task._id} to intern ${intern._id}`);
    }

    // Add task to project if projectId provided
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        project.tasks.push(task._id);
        await project.save();
        console.log(`Added task ${task._id} to project ${project._id}`);
      }
    }

    res.status(201).json(await task.populate("assignedTo", "name email skills"));
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status, dueDate },
      { new: true }
    ).populate("assignedTo", "name email skills");
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
