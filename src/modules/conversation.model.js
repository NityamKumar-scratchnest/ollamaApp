import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);