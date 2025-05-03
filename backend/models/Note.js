import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    status: { type: String, default: "in-progress" },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Note = mongoose.model("Note", noteSchema);

export default Note;
