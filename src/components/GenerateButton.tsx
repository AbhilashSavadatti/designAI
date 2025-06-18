import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onClick, 
  loading = false, 
  disabled = false 
}) => (
  <div className="text-center">
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
        disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:scale-105'
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          Generating Designs...
        </span>
      ) : (
        'Generate Design Concepts'
      )}
    </button>
  </div>
);