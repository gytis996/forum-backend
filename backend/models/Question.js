import mongoose from "../db.js";

const QuestionSchema = new mongoose.Schema({
  question_text: String,
  date: { type: Date, default: Date.now },
  user_id: String,
});

export default mongoose.model("Question", QuestionSchema);
