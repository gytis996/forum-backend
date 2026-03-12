import express from "express";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/question/:id", async (req, res) => {
  try {
    const answers = await Answer.find({ question_id: req.params.id }).sort({
      date: -1,
    });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching answers" });
  }
});

router.post("/question/:id", auth, async (req, res) => {
  try {
    if (!req.body.answer_text) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

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

router.post("/:id/like", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const userId = req.user.id;

    if (answer.likes.includes(userId)) {
      answer.likes = answer.likes.filter((id) => id.toString() !== userId);
    } else {
      answer.dislikes = answer.dislikes.filter(
        (id) => id.toString() !== userId,
      );

      answer.likes.push(userId);
    }

    answer.gained_likes_number = answer.likes.length - answer.dislikes.length;

    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: "Error liking answer" });
  }
});

router.post("/:id/dislike", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const userId = req.user.id;

    if (answer.dislikes.includes(userId)) {
      answer.dislikes = answer.dislikes.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      answer.likes = answer.likes.filter((id) => id.toString() !== userId);
      answer.dislikes.push(userId);
    }

    answer.gained_likes_number = answer.likes.length - answer.dislikes.length;

    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: "Error disliking answer" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.user_id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this answer" });
    }

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
