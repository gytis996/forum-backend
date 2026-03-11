import express from "express";
import Answer from "../models/Answer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/question/:id/answers", async (req, res) => {
  try {
    const answers = await Answer.find({ question_id: req.params.id });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching answers" });
  }
});

router.post("/question/:id/answers", auth, async (req, res) => {
  try {
    if (!req.body.answer_text)
      return res.status(400).json({ message: "Answer text is required" });

    const answer = await Answer.create({
      answer_text: req.body.answer_text,
      question_id: req.params.id,
      user_id: req.user.id,
    });
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: "Error creating answer" });
  }
});

router.post("/answer/:id/like", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Not found" });

    answer.gained_likes_number += 1;
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: "Error liking answer" });
  }
});

router.post("/answer/:id/dislike", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Not found" });

    answer.gained_likes_number -= 1;
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: "Error disliking answer" });
  }
});

router.delete("/answer/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Not found" });

    if (answer.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
