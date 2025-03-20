"use client";
import { useState } from "react";
import Quiz from "@/components/Quiz";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleQuizSubmit = (data: { score: number; analysis: string }) => {
    router.push(`/results?score=${data.score}&analysis=${encodeURIComponent(data.analysis)}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Quiz onSubmit={handleQuizSubmit} />
    </div>
  );
}
