import { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { speechService } from '../../Services/speech';

const useCases = [
  { value: 'interior', label: 'Interior Design' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'construction', label: 'Construction' },
  { value: 'event', label: 'Event Design' }
];

const alertStyles = {
  error: { background: '#fee2e2', color: '#b91c1c', icon: <FaExclamationTriangle /> },
  info: { background: '#dbeafe', color: '#1d4ed8', icon: <FaInfoCircle /> },
  warning: { background: '#fef3c7', color: '#b45309', icon: <FaExclamationTriangle /> }
};

export default function PromptInterface({ onSubmit }) {
  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState('interior');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [microphoneAvailable, setMicrophoneAvailable] = useState(false);
  const [recordingControl, setRecordingControl] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const available = await speechService.isMicrophoneAvailable();
        setMicrophoneAvailable(available);
      } catch (error) {
        console.error('Microphone check failed:', error);
        setMicrophoneAvailable(false);
      }
    };
    checkMicrophone();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      showToast('Please enter a design prompt', 'error');
      return;
    }
    onSubmit({ prompt: prompt.trim(), useCase });
  };

  const handleVoiceInput = async () => {
    if (!microphoneAvailable) {
      setSpeechError('Microphone access not available. Please check permissions.');
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    setSpeechError('');
    setIsRecording(true);
    
    try {
      if (speechService.isSpeechRecognitionSupported()) {
        try {
          const transcript = await speechService.getVoiceInput(false);
          setPrompt(prev => `${prev} ${transcript}`.trim());
          setIsRecording(false);
          showToast('Voice input captured successfully', 'info');
          return;
        } catch (error) {
          console.log('Web Speech API failed, falling back to Whisper API');
        }
      }
      
      const control = await speechService.getVoiceInput(true);
      setRecordingControl(control);
    } catch (error) {
      handleVoiceError(`Failed to start recording: ${error.message}`);
    }
  };

  const stopRecording = async () => {
    setIsTranscribing(true);
    
    try {
      if (recordingControl) {
        const transcript = await recordingControl.stopAndTranscribe();
        if (transcript) {
          setPrompt(prev => `${prev} ${transcript}`.trim());
          showToast('Voice input transcribed successfully', 'info');
        }
      }
    } catch (error) {
      handleVoiceError(`Transcription failed: ${error.message}`);
    } finally {
      resetRecordingState();
    }
  };

  const resetRecordingState = () => {
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordingControl(null);
  };

  const handleVoiceError = (message) => {
    setSpeechError(message);
    resetRecordingState();
  };

  const handleClearPrompt = () => {
    setPrompt('');
    setSpeechError('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <select 
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          backgroundColor: 'white',
          fontSize: '1rem'
        }}
      >
        {useCases.map((uc) => (
          <option key={uc.value} value={uc.value}>{uc.label}</option>
        ))}
      </select>
      
      <div style={{ position: 'relative' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your design vision... (e.g., 'A modern 3BHK apartment with open kitchen and home office')"
          rows={5}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            fontSize: '1rem',
            minHeight: '120px'
          }}
        />
        
        {prompt && (
          <button
            onClick={handleClearPrompt}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#6b7280'
            }}
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {speechError && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          ...alertStyles.error,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {alertStyles.error.icon}
          <span style={{ fontSize: '0.875rem' }}>{speechError}</span>
        </div>
      )}
      
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        width: '100%'
      }}>
        <button 
          onClick={handleSubmit}
          disabled={!prompt.trim()}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            opacity: !prompt.trim() ? 0.6 : 1
          }}
        >
          <FaCheck style={{ marginRight: '0.5rem' }} />
          Generate Designs
        </button>
        
        <button 
          onClick={handleVoiceInput}
          disabled={!microphoneAvailable || isTranscribing}
          style={{
            minWidth: '140px',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: isRecording ? '#ef4444' : 'transparent',
            color: isRecording ? 'white' : '#3b82f6',
            border: isRecording ? 'none' : '1px solid #3b82f6',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: (!microphoneAvailable || isTranscribing) ? 0.6 : 1
          }}
        >
          {isTranscribing ? (
            <span className="spinner" style={{
              display: 'inline-block',
              width: '1rem',
              height: '1rem',
              border: '2px solid rgba(0,0,0,0.3)',
              borderRadius: '50%',
              borderTopColor: '#3b82f6',
              animation: 'spin 1s linear infinite'
            }} />
          ) : isRecording ? (
            <FaMicrophoneSlash />
          ) : (
            <FaMicrophone />
          )}
          {isTranscribing ? 'Processing' : isRecording ? 'Stop' : 'Voice'}
        </button>
      </div>

      {isRecording && !isTranscribing && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          ...alertStyles.info,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {alertStyles.info.icon}
          <span style={{ fontSize: '0.875rem' }}>
            🎤 Recording... Speak clearly and click "Stop" when finished.
          </span>
        </div>
      )}

      {!microphoneAvailable && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          ...alertStyles.warning,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {alertStyles.warning.icon}
          <span style={{ fontSize: '0.875rem' }}>
            Microphone access is blocked. Please enable permissions to use voice input.
          </span>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '1rem',
          borderRadius: '0.375rem',
          ...alertStyles[toast.type],
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {alertStyles[toast.type].icon}
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}