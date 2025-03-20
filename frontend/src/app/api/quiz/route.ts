import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user_id, answers } = await request.json();
    
    const response = await fetch("http://localhost:8000/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, answers }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit quiz");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
