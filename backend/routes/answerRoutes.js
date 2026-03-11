import express from "express";
import Answer from "../models/Answer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/question/:id/answers", async (req, res) => {
  const answers = await Answer.find({ question_id: req.params.id });
  res.json(answers);
});

router.post("/question/:id/answers", auth, async (req, res) => {
  const answer = await Answer.create({
    answer_text: req.body.answer_text,
    question_id: req.params.id,
  });
  res.json(answer);
});

router.delete("/answer/:id", auth, async (req, res) => {
  await Answer.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.post("/answer/:id/like", auth, async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  answer.gained_likes_number++;
  await answer.save();
  res.json(answer);
});

export default router;
