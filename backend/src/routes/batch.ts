import express from "express";
import { AppDataSource } from "../config/database";
import { UserQuiz } from "../models/UserQuiz";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();
const quizRepository = AppDataSource.getRepository(UserQuiz);

// Batch Analysis Endpoint
router.get("/batch", async (req, res) => {
    try {
        const allQuizzes = await quizRepository.find();
        const totalUsers = allQuizzes.length;
        const avgScore = totalUsers ? allQuizzes.reduce((sum, q) => sum + q.score, 0) / totalUsers : 0;

        const batchPrompt = `
        Career Readiness Batch Analysis:
        - Total Users: ${totalUsers}
        - Average Readiness Score: ${avgScore}/100
        - Identify common trends, strengths, and weaknesses.
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: "You are a career readiness analyst." }, { role: "user", content: batchPrompt }],
            }),
        });

        const data = await response.json();
        res.json({ batch_analysis: data.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
