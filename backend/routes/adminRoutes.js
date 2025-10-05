import express from "express";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import Resource from "../models/Resource.js";
import Intern from "../models/Intern.js";

const router = express.Router();

// Register admin
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ _id: admin._id, name: admin.name, email: admin.email, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/resources", async (req, res) => {
  try {
    const { title, description, fileUrl, link, assignedTo } = req.body;
    const resource = new Resource({ title, description, fileUrl, link, assignedTo });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all resources
router.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find().populate("assignedTo", "name email");
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
