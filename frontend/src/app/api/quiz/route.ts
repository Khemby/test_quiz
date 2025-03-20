import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user_id, answers } = await request.json();

    console.log("Forwarding request to backend:", { user_id, answers }); // Debugging log
    
    const response = await fetch("http://localhost:5000/quiz/submit", { //Update this to AWS
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, answers }),
    });
    

    const data = await response.json();
    console.log("📌 Backend Response in API Route:", data); // ✅ Debugging log

    if (!response.ok) {
      throw new Error(data.error || "Unknown error occurred.");
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("🚨 Error in Next.js API route:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("🚨 Unknown error in Next.js API route:", error);
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
