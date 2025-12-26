export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string; // Base64 or URL
    video?: string; // URL to video
    audio?: string; // Base64 audio
    isLoading?: boolean;
    timestamp: Date;
    groundingMetadata?: any;
}

export enum GeminiModel {
    CHAT_PRO = 'gemini-3-pro-preview',
    CHAT_FLASH = 'gemini-3-flash-preview',
    FLASH_LITE = 'gemini-2.5-flash-lite-latest',
    IMAGE_GEN_PRO = 'gemini-3-pro-image-preview',
    IMAGE_GEN_FLASH = 'gemini-2.5-flash-image',
    VEO_FAST = 'veo-3.1-fast-generate-preview',
    LIVE_AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025',
    TTS = 'gemini-2.5-flash-preview-tts'
}

export interface ChatState {
    messages: Message[];
    isThinking: boolean;
    isGeneratingVideo: boolean;
    useSearch: boolean;
    useMaps: boolean;
    selectedAspectRatio: string;
    selectedImageSize: string;
}
