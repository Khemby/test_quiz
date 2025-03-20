import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import quizRoutes from "./routes/quiz";
import batchRoutes from "./routes/batch";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
connectDB();


// Routes
app.use("/quiz", quizRoutes);


app.get("/", (req, res) => {
    res.send("Career Readiness Quiz API (Node.js + PostgreSQL)");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
