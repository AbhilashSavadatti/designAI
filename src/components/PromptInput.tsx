import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Describe your vision...",
  disabled = false 
}) => (
  <div className="flex-1">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
    />
  </div>
);