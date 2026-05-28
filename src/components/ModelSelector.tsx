import React from "react";
import { MasidyModel } from "../types";

interface ModelSelectorProps {
  selectedModel: string;
  availableModels: MasidyModel[];
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
  selectedModel,
  availableModels,
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = availableModels.find(m => m.id === selectedModel);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        🤖 AI Model
      </label>
      <div className="flex items-center gap-2">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      {currentModel && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {currentModel.description}
        </p>
      )}
    </div>
  );
}
