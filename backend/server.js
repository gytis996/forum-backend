import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(questionRoutes);
app.use(answerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
