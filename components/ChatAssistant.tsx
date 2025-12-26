import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { geminiService } from '../services/geminiService';
import { Message, GeminiModel } from '../types';
import { LiveSession } from './LiveSession';
import { blobToBase64 } from '../services/audioUtils';

export const ChatAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLiveOpen, setIsLiveOpen] = useState(false);
    const [attachment, setAttachment] = useState<{data: string, mimeType: string} | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await blobToBase64(file);
            setAttachment({ data: base64, mimeType: file.type });
        }
    };

    const handleSend = async (textOverride?: string) => {
        const text = textOverride || inputText;
        if ((!text.trim() && !attachment) || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: new Date(),
            image: attachment?.mimeType.startsWith('image') ? `data:${attachment.mimeType};base64,${attachment.data}` : undefined
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setAttachment(null);
        setIsLoading(true);

        try {
            const res = await geminiService.generateContent(
                userMsg.text, 
                GeminiModel.CHAT_PRO,
                attachment ? [attachment] : [],
                { isThinking: true }
            );
            
            const modelMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: res.text || "I couldn't generate a response.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full relative">
                {isLiveOpen && <LiveSession onClose={() => setIsLiveOpen(false)} />}
                
                {/* Header for Mobile */}
                <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-card-dark border-b border-[#f0f4f2] dark:border-[#2a4533]">
                     <div className="flex items-center">
                        <MobileMenu />
                        <span className="font-bold text-lg">bautomatex</span>
                     </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-32">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
                            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/30 mb-8">
                                <span className="material-symbols-outlined text-white text-[32px]">auto_awesome</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#111813] dark:text-white mb-2">
                                Hola Alex, soy tu asistente de bautomatex.
                            </h2>
                            <p className="text-xl text-[#8baaa0] font-medium text-center mb-12">
                                ¿Qué te gustaría automatizar hoy?
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                {[
                                    { icon: 'description', title: 'Generar Reporte', desc: 'Crear resumen semanal de ventas y enviar por email.' },
                                    { icon: 'sync', title: 'Sincronizar CRM', desc: 'Actualizar leads de formulario web a HubSpot.' },
                                    { icon: 'receipt_long', title: 'Procesar Facturas', desc: 'Extraer datos de PDFs y guardar en Excel.' },
                                ].map((item, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(`Quiero ${item.title.toLowerCase()}`)}
                                        className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-transparent hover:border-primary/50 shadow-sm hover:shadow-md transition-all text-left group"
                                    >
                                        <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl mx-auto pt-8">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                     <div className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 max-w-[90%]`}>
                                        {msg.role === 'model' && (
                                            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shrink-0 shadow-md">
                                                <span className="material-symbols-outlined text-white text-[16px]">smart_toy</span>
                                            </div>
                                        )}
                                        <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                                            msg.role === 'user' 
                                            ? 'bg-primary text-white rounded-br-sm' 
                                            : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                                        }`}>
                                            {msg.text}
                                            {msg.image && <img src={msg.image} className="mt-2 rounded-lg max-w-xs" />}
                                        </div>
                                     </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
                                    <span className="size-2 bg-primary rounded-full animate-bounce"></span>
                                    <span className="size-2 bg-primary rounded-full animate-bounce delay-75"></span>
                                    <span className="size-2 bg-primary rounded-full animate-bounce delay-150"></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 left-0 right-0 px-4 md:px-8 pointer-events-none">
                    <div className="max-w-3xl mx-auto w-full pointer-events-auto">
                        <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                            {['Gmail', 'Outlook 365', 'Son archivos PDF'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm cursor-pointer hover:bg-gray-50">{tag}</span>
                            ))}
                        </div>
                        <div className="relative flex items-center shadow-xl shadow-gray-200/50 dark:shadow-black/40 rounded-full bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileSelect} 
                                accept="image/*"
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="p-4 pl-5 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined rotate-45">attach_file</span>
                            </button>
                            <input 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-gray-400 py-4" 
                                placeholder="Escribe un mensaje..." 
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={() => isLiveOpen ? setIsLiveOpen(false) : setIsLiveOpen(true)} className="p-2 text-gray-400 hover:text-primary mr-1">
                                <span className="material-symbols-outlined">mic</span>
                            </button>
                            <button onClick={() => handleSend()} disabled={isLoading} className="m-2 p-2.5 rounded-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </div>
                         <div className="flex justify-center mt-2">
                             <p className="text-[10px] text-gray-400">La IA puede cometer errores. Verifica los flujos importantes antes de activar.</p>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};