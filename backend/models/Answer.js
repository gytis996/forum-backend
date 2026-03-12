import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  answer_text: { type: String, required: true },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gained_likes_number: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Answer", AnswerSchema);
