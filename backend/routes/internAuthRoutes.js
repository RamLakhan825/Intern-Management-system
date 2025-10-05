import express from "express";
import Intern from "../models/Intern.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // replace with env variable in production

// Intern registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const internExists = await Intern.findOne({ email });
    if (internExists) return res.status(400).json({ message: "Intern already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const intern = await Intern.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: intern._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, intern: { id: intern._id, name: intern.name, email: intern.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Intern login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const intern = await Intern.findOne({ email });
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    const isMatch = await bcrypt.compare(password, intern.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: intern._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, intern: { id: intern._id, name: intern.name, email: intern.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
