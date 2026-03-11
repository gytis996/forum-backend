import express from "express";
import Question from "../models/Question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  const questions = await Question.find().sort({ date: -1 });
  res.json(questions);
});

router.post("/question", auth, async (req, res) => {
  const question = await Question.create({
    question_text: req.body.question_text,
    user_id: req.user.id,
  });
  res.json(question);
});

router.delete("/question/:id", auth, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
