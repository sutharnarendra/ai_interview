'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface SimpleInterviewRoomProps {
  interviewId: string;
  interviewContext: any;
  onEnd: () => void;
}

export default function SimpleInterviewRoom({
  interviewId,
  interviewContext,
  onEnd
}: SimpleInterviewRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentRound, setCurrentRound] = useState('HR');
  const [aiSpeaking, setAiSpeaking] = useState(false);
  
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startWebcam();
    fetchInitialGreeting();
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast({
        title: 'Webcam Error',
        description: 'Could not access webcam. Interview will continue without video.',
        variant: 'destructive'
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const fetchInitialGreeting = async () => {
    setIsProcessing(true);
    try {
      console.log('Fetching initial greeting...');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/voice/initial-greeting`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interviewContext })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch greeting');
      }

      const greetingText = response.headers.get('X-Greeting-Text');
      console.log('Greeting text:', greetingText);
      
      if (greetingText) {
        setMessages([{
          speaker: 'ai',
          text: greetingText,
          timestamp: new Date()
        }]);

        const audioBlob = await response.blob();
        console.log('Greeting audio size:', audioBlob.size);
        
        if (audioBlob.size > 0) {
          playAudio(audioBlob);
        } else {
          console.warn('Greeting audio is empty');
          toast({
            title: 'Audio Notice',
            description: 'AI greeting loaded (text only). Click anywhere to enable audio.',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching greeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to start interview. Please refresh and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Use highest quality available
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Audio chunk received:', event.data.size, 'bytes');
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        console.log('Recording stopped. Total size:', audioBlob.size, 'bytes');
        
        if (audioBlob.size < 1000) {
          toast({
            title: 'Recording Too Short',
            description: 'Please speak for at least 2-3 seconds and try again.',
            variant: 'destructive'
          });
        } else {
          await sendAudioToBackend(audioBlob);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      // Record in chunks for better data collection
      mediaRecorder.start(100); // 100ms chunks
      setIsRecording(true);
      
      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('interviewId', interviewId);
      formData.append('interviewContext', JSON.stringify(interviewContext));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/voice/process-audio`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const userText = response.headers.get('X-Transcript-User');
      const aiText = response.headers.get('X-Transcript-AI');

      if (userText && aiText) {
        setMessages(prev => [
          ...prev,
          { speaker: 'user', text: userText, timestamp: new Date() },
          { speaker: 'ai', text: aiText, timestamp: new Date() }
        ]);

        const audioBlob = await response.blob();
        playAudio(audioBlob);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Processing Error',
        description: 'Failed to process your response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioBlob: Blob) => {
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      // Check if blob has data
      if (audioBlob.size === 0) {
        console.error('Empty audio blob');
        setAiSpeaking(false);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      // Set volume
      audio.volume = 1.0;
      
      audio.onloadeddata = () => {
        console.log('Audio loaded, duration:', audio.duration);
      };
      
      audio.onplay = () => {
        console.log('Audio playing');
        setAiSpeaking(true);
      };
      
      audio.onended = () => {
        console.log('Audio ended');
        setAiSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setAiSpeaking(false);
        toast({
          title: 'Audio Error',
          description: 'Could not play AI response audio',
          variant: 'destructive'
        });
      };
      
      // Play audio
      audio.play().catch(err => {
        console.error('Audio play error:', err);
        setAiSpeaking(false);
        toast({
          title: 'Playback Error',
          description: 'Click anywhere on the page to enable audio, then try again',
          variant: 'destructive'
        });
      });
    } catch (error) {
      console.error('Error creating audio:', error);
      setAiSpeaking(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div>
          <h2 className="text-lg font-bold">{interviewContext.jobRole} Interview</h2>
          <p className="text-sm text-gray-400">Round: {currentRound}</p>
        </div>
        <div className="flex items-center gap-2">
          {aiSpeaking && (
            <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full">
              <Volume2 className="h-4 w-4 animate-pulse" />
              <span className="text-sm">AI Speaking...</span>
            </div>
          )}
          <Button variant="destructive" onClick={onEnd}>
            End Interview
          </Button>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex">
        {/* Left Side - Your Video */}
        <div className="w-1/2 bg-black relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Your Video Label */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
            You
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant={videoEnabled ? "default" : "destructive"}
              onClick={toggleVideo}
              className="rounded-full"
            >
              {videoEnabled ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Right Side - AI Interviewer & Transcript */}
        <div className="w-1/2 flex flex-col bg-gray-800">
          {/* AI Avatar/Placeholder */}
          <div className="h-1/2 bg-gradient-to-br from-blue-900 to-purple-900 relative flex items-center justify-center">
            <div className="text-center text-white">
              <div className={`w-32 h-32 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-4 ${
                aiSpeaking ? 'ring-4 ring-blue-400 animate-pulse' : ''
              }`}>
                <span className="text-6xl">🤖</span>
              </div>
              <p className="text-lg font-semibold">AI Interviewer</p>
              {aiSpeaking && <p className="text-sm text-blue-300 mt-2">Speaking...</p>}
            </div>
            
            {/* AI Label */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
              AI Interviewer
            </div>
          </div>

          {/* Transcript Area */}
          <div className="h-1/2 bg-gray-900 overflow-y-auto p-4 space-y-3">
            <div className="text-white text-sm font-semibold mb-2 sticky top-0 bg-gray-900 py-2">
              Live Transcript
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.speaker === 'user'
                    ? 'bg-blue-600 text-white ml-auto max-w-[80%]'
                    : 'bg-gray-700 text-white mr-auto max-w-[80%]'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {message.speaker === 'user' ? 'You' : 'AI Interviewer'}
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="flex items-center justify-center gap-6">
          <Button
            size="lg"
            variant={isRecording ? 'destructive' : 'default'}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || aiSpeaking}
            className={`rounded-full w-20 h-20 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-400'
            }`}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          
          <div className="text-center text-white">
            {isRecording ? (
              <p className="text-lg font-semibold text-red-400">🔴 Recording... Click to stop</p>
            ) : isProcessing ? (
              <p className="text-lg font-semibold text-blue-400">⏳ Processing your response...</p>
            ) : aiSpeaking ? (
              <p className="text-lg font-semibold text-green-400">🗣️ AI is speaking, please wait...</p>
            ) : (
              <p className="text-lg text-gray-300">Click microphone to answer the question</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}