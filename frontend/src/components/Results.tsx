"use client";

export default function Results({ score, analysis }: { score: number; analysis: string }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">Your Results</h1>
      <p className="mt-2 text-gray-700">
        <strong>Score:</strong> {score}/100
      </p>
      <label className="font-medium text-gray-800 mt-3 block">AI Analysis</label>
      <textarea className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" readOnly value={analysis} />
    </div>
  );
}
