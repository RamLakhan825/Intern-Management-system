import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  interns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Intern" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
