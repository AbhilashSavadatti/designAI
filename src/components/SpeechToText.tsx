import React from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SpeechToTextProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const SpeechToText: React.FC<SpeechToTextProps> = ({ 
  onTranscript, 
  disabled = false 
}) => {
  const { startListening, isListening, isSupported } = useSpeechRecognition();

  const handleClick = () => {
    if (disabled || isListening) return;
    
    startListening(
      (transcript) => onTranscript(transcript),
      (error) => alert(`Speech recognition error: ${error}`)
    );
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="px-5 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
      >
        🎤 Not Supported
      </button>
    );
  }

  return (
    
    <>
     <div className="relative">
    
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20 scale-110"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse opacity-30 scale-105"></div>
          </>
        )}
        
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`

            relative z-10 group
            w-16 h-16 rounded-full
            backdrop-blur-xl border-2
            flex items-center justify-center
            font-medium transition-all duration-300 ease-out
            shadow-lg hover:shadow-2xl
            transform hover:scale-110 active:scale-95
            ${disabled 
              ? 'bg-gray-100/80 border-gray-300 text-gray-400 cursor-not-allowed shadow-sm' 
              : isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400/50 text-white shadow-red-500/25 animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/50 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
            }
          `}
        >
          
          <svg 
            className={`w-7 h-7 transition-transform duration-200 ${
              isListening ? 'scale-110' : 'group-hover:scale-105'
            }`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <path d="M12 18v4"/>
            <path d="M8 22h8"/>
          </svg>
          
          {/* Inner glow effect */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isListening 
              ? 'bg-white/20 opacity-100' 
              : 'bg-white/10 opacity-0 group-hover:opacity-100'
          }`}></div>
        </button>
      </div>


      <div className="text-start space-y-2">
        <p className={` text-lg font-semibold transition-colors duration-300 ${
          isListening 
            ? 'text-red-600 animate-pulse' 
            : disabled 
              ? 'text-gray-400' 
              : 'text-gray-700'
        }`}>
          {isListening ? 'Listening...' : disabled ? 'Mic Disabled' : ' '}
        </p>
        
        {isListening && (
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
      </div>
    </>
   

  );
};

export {}