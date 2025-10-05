// models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    fileUrl: String, // optional file URL
    link: String, // optional link
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Intern" }],
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
