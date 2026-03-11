import mongoose from "../db.js";

const AnswerSchema = new mongoose.Schema({
  answer_text: String,
  date: { type: Date, default: Date.now },
  gained_likes_number: { type: Number, default: 0 },
  question_id: String,
});

export default mongoose.model("Answer", AnswerSchema);
