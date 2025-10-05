import express from "express";
import Intern from "../models/Intern.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all interns
router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new intern
router.post("/", async (req, res) => {
  const { name, email, password, skills } = req.body;
  try {
    const internExists = await Intern.findOne({ email });
    if (internExists) return res.status(400).json({ message: "Intern already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const intern = await Intern.create({ name, email, password: hashedPassword, skills });
    res.status(201).json(intern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update intern
router.put("/:id", async (req, res) => {
  try {
    const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(intern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete intern
router.delete("/:id", async (req, res) => {
  try {
    await Intern.findByIdAndDelete(req.params.id);
    res.json({ message: "Intern deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
