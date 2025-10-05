import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Intern" }], // multiple interns
  status: { type: String, default: "pending" }, // pending, in-progress, completed
  dueDate: { type: Date },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
