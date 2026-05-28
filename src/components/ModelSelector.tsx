import React, { useState, useEffect } from "react";
import { MasidyModel } from "../types";
import { Lock } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  availableModels: MasidyModel[];
  userTier?: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
  selectedModel,
  availableModels,
  userTier = "FREE",
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = availableModels.find(m => m.id === selectedModel);
  
  // Models locked by tier
  const tierLocks: { [key: string]: string[] } = {
    "FREE": ["starter-research", "base-research", "base-code", "pro-general", "pro-research", "pro-code", "pro-creative", "max-general", "max-research", "max-code", "max-creative", "max-premium"],
    "STARTER": ["base-code", "pro-general", "pro-research", "pro-code", "pro-creative", "max-general", "max-research", "max-code", "max-creative", "max-premium"],
    "BASE": ["pro-general", "pro-research", "pro-code", "pro-creative", "max-general", "max-research", "max-code", "max-creative", "max-premium"],
    "PRO": ["max-general", "max-research", "max-code", "max-creative", "max-premium"],
    "MAX": []
  };
  
  const lockedModels = tierLocks[userTier] || [];
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        🤖 AI Model {userTier !== "FREE" && <span className="text-xs font-normal">({userTier})</span>}
      </label>
      <div className="flex items-center gap-2">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {availableModels.map((model) => {
            const isLocked = lockedModels.includes(model.id);
            return (
              <option 
                key={model.id} 
                value={model.id}
                disabled={isLocked}
              >
                {isLocked ? `🔒 ${model.name}` : model.name}
              </option>
            );
          })}
        </select>
      </div>
      {currentModel && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentModel.description}
          </p>
        </div>
      )}
      {userTier === "FREE" && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Upgrade to unlock more models
        </p>
      )}
    </div>
  );
}
