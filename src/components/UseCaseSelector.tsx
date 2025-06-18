import React from 'react';
import { USE_CASES } from '../utils/constants';

interface UseCaseSelectorProps {
  value: string;
  onChange: (useCase: string) => void;
  useCases?: readonly string[];
}

export const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({ 
  value, 
  onChange, 
  useCases = USE_CASES 
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Use Case
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      <option value="">Choose your design category...</option>
      {useCases.map((useCase) => (
        <option key={useCase} value={useCase}>
          {useCase}
        </option>
      ))}
    </select>
  </div>
);

export {}