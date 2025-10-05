import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }],
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

const Intern = mongoose.model("Intern", internSchema);
export default Intern;
