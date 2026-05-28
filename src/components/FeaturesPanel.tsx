import React, { useState } from "react";

interface Feature {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export default function FeaturesPanel() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const features: Feature[] = [
    { id: "images", label: "Generate Images", icon: "🖼️", description: "Create images from text prompts" },
    { id: "research", label: "Web Research", icon: "🔍", description: "Search the web for information" },
    { id: "files", label: "Upload Files", icon: "📄", description: "Analyze documents and code" },
    { id: "code", label: "Execute Code", icon: "⚙️", description: "Run Python or JavaScript safely" },
  ];

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Image generation failed:", err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  const handleExecuteCode = async () => {
    if (!codeInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput, language: codeLanguage }),
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Code execution failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Feature Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              activeFeature === feature.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
            }`}
          >
            <div className="text-2xl">{feature.icon}</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{feature.label}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</div>
          </button>
        ))}
      </div>

      {/* Feature Panels */}
      {activeFeature === "images" && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Describe the image you want to generate..."
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
          {results?.url && (
            <img src={results.url} alt={results.prompt} className="w-full rounded-lg" />
          )}
        </div>
      )}

      {activeFeature === "research" && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Enter your research query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Web"}
          </button>
          {results?.results && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{results.results.query}</h4>
              {results.results.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{results.results.summary}</p>
              )}
              {results.results.url && (
                <a
                  href={results.results.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View Source
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {activeFeature === "code" && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
          <select
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <textarea
            placeholder={`Enter ${codeLanguage} code...`}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            rows={6}
          />
          <button
            onClick={handleExecuteCode}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Executing..." : "Execute Code"}
          </button>
          {results && (
            <pre className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs overflow-auto text-gray-900 dark:text-gray-100">
              {results.success
                ? results.output || "Code executed successfully"
                : `Error: ${results.error}`}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
