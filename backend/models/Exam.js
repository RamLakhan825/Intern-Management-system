import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true }, // topic for AI question generation
  questions: [
    {
      question: String,
      options: [String],
      answer: String, // correct answer
    }
  ],
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Intern" }],
  scores: [
    {
      intern: { type: mongoose.Schema.Types.ObjectId, ref: "Intern" },
      score: Number,
      completedAt: { type: Date, default: Date.now }, // track submission date
    }
  ],
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
