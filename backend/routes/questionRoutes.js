import express from "express";
import auth from "../middleware/auth.js";
import {
  getQuestions,
  createQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", auth, createQuestion);
router.delete("/:id", auth, deleteQuestion);

export default router;
