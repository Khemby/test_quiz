"use client";
import { useState } from "react";

const Quiz = () => {
  const [userId, setUserId] = useState("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>("");

  const questions = [
    "Do you have a resume prepared?",
    "Are you confident in job interviews?",
    "Do you have experience in your field?",
    "Have you applied for jobs?",
    "Do you have professional networking connections?"
  ];

  const handleChange = (question: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [question]: answer }));
  };

//   const handleSubmit = async () => {
//     if (!userId) {
//       alert("Please enter a User ID");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/quiz", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: userId, answers }),
//       });

//       const data = await response.json();
    
//     console.log("API Response:", data); // ✅ Debugging step

//     if (!response.ok) {
//       throw new Error(data.error || "Unknown error occurred.");
//     }

//     setScore(data.score);
//     setAnalysis(data.analysis);
//   } catch (error) {
//     console.error("Error submitting quiz:", error);
//     if (error instanceof Error) {
//       alert(`Failed to submit quiz: ${error.message}`);
//     } else {
//       alert("Failed to submit quiz: An unknown error occurred.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async () => {
  if (!userId) {
    alert("Please enter a User ID");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/quiz", {  // ✅ Ensure this is the correct API route
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, answers }),
    });

    const text = await response.text();
    console.log("📌 Raw API Response:", text); // ✅ Debugging

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON response from Next.js API route.");
    }

    console.log("📌 Parsed API Response:", data); // ✅ Debugging

    if (!response.ok) {
      throw new Error(data.error || "Unknown error occurred.");
    }

    setScore(data.score);
    setAnalysis(data.analysis);
  } catch (error) {
    console.error("🚨 Error in frontend handleSubmit:", error);
    if (error instanceof Error) {
      alert(`Failed to submit quiz: ${error.message}`);
    } else {
      alert("Failed to submit quiz: An unknown error occurred.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-black">Career Readiness Quiz</h2>
      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 w-full mb-4 text-black"
      />
      {questions.map((question, index) => (
        <div key={index} className="mb-3">
          <p className="text-black">{question}</p>
          <select
            className="border p-2 w-full text-black"
            onChange={(e) => handleChange(question, e.target.value)}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {score !== null && (
        <div className="mt-4 p-3 border rounded">
          <h3 className="font-semibold text-black">Your Score: {score}</h3>
          <p className="mt-2 text-black">{analysis}</p> {/* Black font for analysis */}
        </div>
      )}
    </div>
  );
};

export default Quiz;
