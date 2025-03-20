import express, { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserQuiz } from "../models/UserQuiz";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();
const quizRepository = AppDataSource.getRepository(UserQuiz);

// Function to calculate score
const calculateScore = (answers: { [key: string]: string }): number => {
    return Object.values(answers).reduce((acc, ans) => acc + (ans === "Yes" ? 10 : 5), 0);
};

// Function to generate AI analysis
const generateAIAnalysis = async (user_id: string, answers: object, score: number): Promise<string> => {
    const prompt = `
    User ID: ${user_id}
    Career Readiness Score: ${score}/100
    User Answers: ${JSON.stringify(answers)}

    Provide a career readiness analysis, strengths, and improvement areas.
    `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: "You are a career advisor." }, { role: "user", content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API error:", errorData);
            return "Unable to generate analysis at this time due to API issues. Please try again later.";
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || "Analysis could not be generated.";
    } catch (error) {
        console.error("Error generating analysis:", error);
        return "An unexpected error occurred while generating analysis.";
    }
};

// FIX: Ensure function returns `Promise<void>`
router.post("/submit", async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, answers } = req.body;

        if (!user_id || !answers) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const score = calculateScore(answers);
        const analysis = await generateAIAnalysis(user_id, answers, score);

        // FIX: Ensure `answers` field is saved
        const newQuiz = new UserQuiz();
        newQuiz.user_id = user_id;
        newQuiz.answers = answers;
        newQuiz.score = score;
        newQuiz.analysis = analysis;

        await quizRepository.save(newQuiz);

        res.json({ score, analysis }); // FIX: Response is inside function, no return outside
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// FIX: Ensure function returns `Promise<void>`
router.get("/results/:userId", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // FIX: Use `findOne` instead of deprecated `findOneBy`
        const quizResults = await quizRepository.findOne({ where: { user_id: userId } });

        if (!quizResults) {
            res.status(404).json({ error: "Quiz results not found" });
            return;
        }

        res.json(quizResults); // FIX: Response is inside function, no return outside
    } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
