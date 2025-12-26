import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';

interface LiveSessionProps {
    onClose: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ onClose }) => {
    const [status, setStatus] = useState<'connecting' | 'active' | 'error' | 'closed'>('connecting');
    const [transcripts, setTranscripts] = useState<string[]>([]);
    
    // Refs for cleanup and audio loop
    const sessionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const inputContextRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let mounted = true;

        const startSession = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                // Setup Audio Contexts
                const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                inputContextRef.current = inputCtx;
                audioContextRef.current = outputCtx;

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                    callbacks: {
                        onopen: () => {
                            if (!mounted) return;
                            setStatus('active');
                            console.log("Live Session Open");

                            // Setup Input Stream
                            const source = inputCtx.createMediaStreamSource(stream);
                            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                            scriptProcessor.onaudioprocess = (e) => {
                                const inputData = e.inputBuffer.getChannelData(0);
                                const pcmBlob = createBlob(inputData);
                                sessionPromise.then(session => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };
                            source.connect(scriptProcessor);
                            scriptProcessor.connect(inputCtx.destination);
                        },
                        onmessage: async (msg) => {
                            if (!mounted) return;
                            // Handle Audio Output
                            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                            if (audioData) {
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                                const audioBuffer = await decodeAudioData(
                                    decode(audioData),
                                    outputCtx,
                                    24000,
                                    1
                                );
                                const source = outputCtx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(outputCtx.destination);
                                source.addEventListener('ended', () => {
                                    sourcesRef.current.delete(source);
                                });
                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                sourcesRef.current.add(source);
                            }

                            // Interruption
                            if (msg.serverContent?.interrupted) {
                                sourcesRef.current.forEach(s => s.stop());
                                sourcesRef.current.clear();
                                nextStartTimeRef.current = 0;
                            }
                        },
                        onclose: () => {
                            if(mounted) setStatus('closed');
                        },
                        onerror: (e) => {
                            console.error(e);
                            if(mounted) setStatus('error');
                        }
                    },
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                        }
                    }
                });
                
                // Force session to start immediately
                sessionRef.current = sessionPromise;

            } catch (err) {
                console.error("Live Connect Error", err);
                setStatus('error');
            }
        };

        startSession();

        return () => {
            mounted = false;
            // Cleanup
            if (sessionRef.current) {
                sessionRef.current.then((s: any) => s.close());
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioContextRef.current) audioContextRef.current.close();
            if (inputContextRef.current) inputContextRef.current.close();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-[#15231b] w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-8 relative overflow-hidden">
                {/* Background Pulse Animation */}
                {status === 'active' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                         <div className="size-64 bg-primary rounded-full animate-pulse-slow blur-3xl"></div>
                    </div>
                )}
                
                <h2 className="text-2xl font-bold text-[#111813] dark:text-white z-10">Gemini Live Voice</h2>
                
                <div className={`size-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    status === 'active' ? 'bg-gradient-to-br from-primary to-green-400 shadow-[0_0_40px_rgba(74,222,128,0.5)] scale-110' : 
                    status === 'error' ? 'bg-red-500' : 'bg-gray-700'
                }`}>
                    <span className="material-symbols-outlined text-white text-6xl">
                        {status === 'active' ? 'graphic_eq' : status === 'error' ? 'error' : 'mic_off'}
                    </span>
                </div>

                <p className="text-gray-500 dark:text-gray-300 font-medium z-10">
                    {status === 'connecting' && "Connecting..."}
                    {status === 'active' && "Listening & Speaking..."}
                    {status === 'error' && "Connection Failed"}
                    {status === 'closed' && "Session Ended"}
                </p>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-gray-100 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-white hover:text-red-600 rounded-2xl font-bold transition-colors z-10"
                >
                    End Call
                </button>
            </div>
        </div>
    );
};
