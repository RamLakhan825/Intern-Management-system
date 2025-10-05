import express from "express";
import Project from "../models/Project.js";
import Intern from "../models/Intern.js";

const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("interns", "name email skills");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new project
router.post("/", async (req, res) => {
  const { title, description, internIds } = req.body;
  try {
    const interns = await Intern.find({ _id: { $in: internIds } });
    const project = await Project.create({ title, description, interns: interns.map(i => i._id) });
    res.status(201).json(await project.populate("interns", "name email skills"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  const { title, description, internIds } = req.body;
  try {
    const interns = await Intern.find({ _id: { $in: internIds } });
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, interns: interns.map(i => i._id) },
      { new: true }
    ).populate("interns", "name email skills");
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
