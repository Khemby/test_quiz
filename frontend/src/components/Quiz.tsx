"use client";
import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: string[];
};

const mockQuestions: Question[] = [
  { id: "Q1", question: "Do you have a well-structured resume?", options: ["Yes", "No"] },
  { id: "Q2", question: "Which best describes your networking strategy?", options: ["A: Very Active", "B: Somewhat Active", "C: Not Active"] },
];

export default function Quiz({ onSubmit }: { onSubmit: (data: { score: number; analysis: string }) => void }) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "test-user", answers }),
    });

    const data = await response.json();
    setLoading(false);
    onSubmit(data); // Pass results to parent page
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Career Readiness Quiz</h1>
      {mockQuestions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="text-lg font-medium text-black">{q.question}</p>
          <div className="mt-2 flex gap-2">
            {q.options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 border rounded-lg text-sm transition duration-300 ${
                  answers[q.id] === option ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleSelect(q.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}
