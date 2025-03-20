"use client";
import { useSearchParams } from "next/navigation";
import Results from "@/components/Results";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const analysis = searchParams.get("analysis");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Results score={Number(score)} analysis={analysis || ""} />
    </div>
  );
}
