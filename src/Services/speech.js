// Speech Service for handling voice input
export class SpeechService {
  constructor() {
    this.recognition = null;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.isListening = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // Initialize speech recognition
  initSpeechRecognition() {
    if (!this.isSupported) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    return this.recognition;
  }

  // Start listening for speech (Web Speech API)
  async startListening() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (!this.recognition) {
        this.initSpeechRecognition();
      }

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.isListening = true;
      this.recognition.start();
    });
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Start recording audio for Whisper API
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  // Stop recording and return audio blob
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        
        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Send audio to backend for transcription
  async transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://localhost:3001/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  // Main method to handle voice input (tries Web Speech API first, falls back to Whisper)
  async getVoiceInput(useWhisper = false) {
    if (useWhisper) {
      // Use Whisper API via backend
      try {
        await this.startRecording();
        return new Promise((resolve, reject) => {
          // Return recording control to caller
          resolve({
            stopAndTranscribe: async () => {
              try {
                const audioBlob = await this.stopRecording();
                const transcript = await this.transcribeAudio(audioBlob);
                return transcript;
              } catch (error) {
                reject(error);
              }
            }
          });
        });
      } catch (error) {
        throw new Error(`Recording failed: ${error.message}`);
      }
    } else {
      // Use Web Speech API
      try {
        return await this.startListening();
      } catch (error) {
        throw new Error(`Speech recognition failed: ${error.message}`);
      }
    }
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported() {
    return this.isSupported;
  }

  // Check if microphone access is available
  async isMicrophoneAvailable() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const speechService = new SpeechService();
