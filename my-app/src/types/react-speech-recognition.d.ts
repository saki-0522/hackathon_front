declare module 'react-speech-recognition' {
    export interface ListeningOptions {
      continuous?: boolean;
      language?: string;
    }
  
    export interface SpeechRecognition {
      startListening: (options?: ListeningOptions) => Promise<void>;
      stopListening: () => void;
      abortListening: () => void;
      browserSupportsSpeechRecognition: boolean;
      transcript: string;
      resetTranscript: () => void;
      listening: boolean;
    }
  
    const useSpeechRecognition: () => SpeechRecognition;
    export default useSpeechRecognition;
  }
  