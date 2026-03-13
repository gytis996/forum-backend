import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

export const getQuestions = async (req, res) => {
  try {
    const { filter } = req.query;

    let questions = await Question.find().sort({ date: -1 }).lean();

    const questionsWithStatus = await Promise.all(
      questions.map(async (q) => {
        const answerCount = await Answer.countDocuments({
          question_id: q._id,
        });

        return {
          ...q,
          answerCount,
          isAnswered: answerCount > 0,
        };
      }),
    );

    let filtered = questionsWithStatus;

    if (filter === "answered") {
      filtered = questionsWithStatus.filter((q) => q.isAnswered);
    }

    if (filter === "unanswered") {
      filtered = questionsWithStatus.filter((q) => !q.isAnswered);
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createQuestion = async (req, res) => {
  if (!req.body.question_text) {
    return res.status(400).json({ message: "Question text required" });
  }

  try {
    const question = await Question.create({
      question_text: req.body.question_text,
      user_id: req.user.id,
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Answer.deleteMany({ question_id: req.params.id });

    await Question.findByIdAndDelete(req.params.id);

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
