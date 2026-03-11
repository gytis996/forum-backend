import express from "express";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const { filter } = req.query;

    let questions = await Question.find().sort({ date: -1 }).lean();

    const questionsWithStatus = await Promise.all(
      questions.map(async (q) => {
        const answerCount = await Answer.countDocuments({ question_id: q._id });
        return { ...q, isAnswered: answerCount > 0, answerCount };
      }),
    );

    let filteredQuestions = questionsWithStatus;
    if (filter === "answered") {
      filteredQuestions = questionsWithStatus.filter((q) => q.isAnswered);
    } else if (filter === "unanswered") {
      filteredQuestions = questionsWithStatus.filter((q) => !q.isAnswered);
    }

    res.json(filteredQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/question", auth, async (req, res) => {
  if (!req.body.question_text)
    return res.status(400).json({ message: "Text is required" });

  try {
    const question = await Question.create({
      question_text: req.body.question_text,
      user_id: req.user.id,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/question/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Not found" });

    if (question.user_id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own questions" });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
