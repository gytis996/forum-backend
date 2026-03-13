import express from "express";
import auth from "../middleware/auth.js";

import {
  getAnswers,
  createAnswer,
  likeAnswer,
  dislikeAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

router.get("/question/:id", getAnswers);

router.post("/question/:id", auth, createAnswer);

router.post("/:id/like", auth, likeAnswer);

router.post("/:id/dislike", auth, dislikeAnswer);

router.delete("/:id", auth, deleteAnswer);

export default router;
