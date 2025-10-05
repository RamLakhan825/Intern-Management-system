import express from "express";
import Exam from "../models/Exam.js";
import Intern from "../models/Intern.js";
import axios from "axios";
import JSON5 from "json5";

const router = express.Router();

// ================================
// Create Exam and generate questions using Ollama AI
// ================================
router.post("/", async (req, res) => {
  const { title, topic, internIds } = req.body;

  try {
    // Validate interns
    const interns = await Intern.find({ _id: { $in: internIds } });
    if (interns.length === 0)
      return res.status(404).json({ message: "No valid interns selected" });

    // Improved AI prompt for meaningful MCQs
    const prompt = `
You are an AI question generator.
Generate exactly 5 multiple-choice questions (MCQs) about the topic "${topic}".
Each question must have:
- "question": a clear and factual question related to "${topic}"
- "options": an array of 4 different, realistic answer choices (not placeholders like A, B, C, D)
- "answer": one of the exact strings from the options array (not a letter)

Output only a valid JSON array, for example:

[
  {
    "question": "Which data structure uses the LIFO principle?",
    "options": ["Queue", "Stack", "Tree", "Heap"],
    "answer": "Stack"
  },
  {
    "question": "Which company developed React?",
    "options": ["Google", "Facebook", "Microsoft", "Netflix"],
    "answer": "Facebook"
  }
]
`;

    // Call Ollama API
    const ollamaResponse = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma:2b",
      prompt,
      max_tokens: 1200,
      stream: false,
    });

    // Combine response text
    let combinedText = "";
    if (Array.isArray(ollamaResponse.data)) {
      combinedText = ollamaResponse.data
        .map((chunk) => chunk.response)
        .filter(Boolean)
        .join("");
    } else if (ollamaResponse.data.response) {
      combinedText = ollamaResponse.data.response;
    } else if (typeof ollamaResponse.data === "string") {
      combinedText = ollamaResponse.data;
    } else {
      combinedText = JSON.stringify(ollamaResponse.data);
    }

    // Clean up AI response
    combinedText = combinedText
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .replace(/,\s*]/g, "]")
      .trim();

    // Extract JSON array
    const jsonMatch = combinedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("❌ No valid JSON array found from AI:", combinedText);
      return res
        .status(500)
        .json({ message: "No valid JSON array found from AI", raw: combinedText });
    }

    // Parse questions
    let questions;
    try {
      questions = JSON5.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message, "Raw:", combinedText);
      return res
        .status(500)
        .json({ message: "Invalid JSON from AI", raw: combinedText });
    }

    // Optional cleanup (remove A)/B. prefixes)
    questions = questions.map((q) => ({
      ...q,
      options: q.options.map((o) => o.replace(/^[A-D][).]\s*/, "").trim()),
    }));

    // Save exam
    const exam = await Exam.create({
      title,
      topic,
      questions,
      assignedTo: interns.map((i) => i._id),
      completed: false,
    });

    const populatedExam = await exam.populate("assignedTo", "name email");
    res.status(201).json(populatedExam);
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    res.status(500).json({ message: error.message });
  }
});

// ================================
// Get all exams
// ================================
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().populate("assignedTo", "name email");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================================
// Get single exam
// ================================
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================================
// Submit exam
// ================================
router.post("/:id/submit", async (req, res) => {
  const { internId, answers } = req.body;

  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    let score = 0;
    answers.forEach((a) => {
      if (exam.questions[a.questionIndex].answer === a.answer) score += 1;
    });

    exam.scores.push({ intern: internId, score });
    await exam.save();

    res.json({ message: "Exam submitted successfully", score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
