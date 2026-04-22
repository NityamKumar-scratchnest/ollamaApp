import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: { type: String, enum: ["user", "assistant"] },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);