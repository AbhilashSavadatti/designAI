import { useState, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  startListening: (
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ) => void;
  isListening: boolean;
  isSupported: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = (
    onResult: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return { startListening, isListening, isSupported };
};

export {}