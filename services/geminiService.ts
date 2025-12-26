import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GeminiModel } from "../types";
import { templateService } from "./templateService";

// Helper to get client (always fresh for Veo key checks)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
    // Basic Chat / Text Generation
    async generateContent(
        prompt: string,
        model: string = GeminiModel.CHAT_PRO,
        attachments: { data: string; mimeType: string }[] = [],
        config: any = {}
    ) {
        const ai = getAiClient();
        const parts: any[] = [];
        
        // 1. Context Enhancement: Search for relevant templates
        const relevantTemplates = templateService.search(prompt).slice(0, 8); // Top 8 matches
        let systemInstruction = "You are bautomatex AI, an expert automation engineer. You help users build, debug, and optimize workflows (n8n/Zapier style).";
        
        if (relevantTemplates.length > 0) {
            const templatesContext = relevantTemplates.map(t => 
                `- Title: ${t.title}\n  Apps: ${t.apps.map(a => a.name).join(', ')}\n  Desc: ${t.description}`
            ).join('\n\n');

            systemInstruction += `\n\nACCESS TO TEMPLATE LIBRARY:\nYou have access to the following approved automation templates. Use these as a "ground truth" reference to CORRECT user workflows, suggest missing steps, or validate their ideas. If a user's JSON or workflow description contradicts these patterns, point it out and suggest the template's approach.\n\nRELEVANT TEMPLATES FOUND:\n${templatesContext}`;
        } else {
             systemInstruction += `\n\nUse your general knowledge of automation tools (Slack, HubSpot, OpenAI, etc.) to assist the user.`;
        }
        
        // 2. Build Content
        attachments.forEach(att => {
            parts.push({
                inlineData: {
                    mimeType: att.mimeType,
                    data: att.data
                }
            });
        });
        
        parts.push({ text: prompt });

        // Add tools if needed
        const tools: any[] = [];
        if (config.useSearch) tools.push({ googleSearch: {} });
        if (config.useMaps) tools.push({ googleMaps: {} });
        
        const finalConfig: any = {
            tools: tools.length > 0 ? tools : undefined,
            systemInstruction: systemInstruction,
            ...config.genConfig
        };

        if (config.isThinking) {
            finalConfig.thinkingConfig = { thinkingBudget: 32768 };
        }

        try {
            const response = await ai.models.generateContent({
                model,
                contents: { parts },
                config: finalConfig
            });
            return response;
        } catch (error) {
            console.error("Gemini Generate Error:", error);
            throw error;
        }
    },

    // --- UPDATED: Workflow Diagnosis & Fix ---
    async diagnoseWorkflow(workflow: any) {
        const ai = getAiClient();
        const model = GeminiModel.CHAT_PRO;

        const workflowJson = JSON.stringify(workflow, null, 2);
        
        // We ask for JSON specifically to re-render the graph
        const prompt = `
            Act as a Senior Automation Architect. Analyze this automation workflow JSON.
            Identify errors, inefficiencies, or logic gaps.
            
            Then, CREATE A FIXED VERSION of the workflow. 
            - Keep existing nodes if they are correct.
            - Add missing nodes (e.g., if missing a parser or data transformation).
            - Correct connections (edges).
            - Ensure coordinates (x, y) are adjusted so the graph looks clean and organized (left to right).

            RETURN ONLY A RAW JSON OBJECT (no markdown formatting, no code blocks) with this exact structure:
            {
                "analysis": "Markdown string with: # DIAGNÓSTICO (summary), # CORRECCIÓN (explanation), # 3 ALTERNATIVAS PROFESIONALES (list)",
                "fixedWorkflow": {
                    "nodes": [ { "id": "...", "type": "...", "x": 0, "y": 0, "data": { "name": "...", "icon": "...", "color": "...", "bg": "..." } } ],
                    "edges": [ { "id": "...", "source": "...", "target": "..." } ]
                },
                "predictedOutcome": "A simulation string describing exactly what happens when this fixed workflow runs (e.g., 'Email received, parsed, and row added to Sheet')."
            }

            WORKFLOW DATA:
            ${workflowJson}
        `;

        try {
            const response = await ai.models.generateContent({
                model,
                contents: { parts: [{ text: prompt }] },
                config: {
                    responseMimeType: "application/json" // Force JSON output
                }
            });
            
            // Parse the JSON
            const responseText = response.text || "{}";
            try {
                return JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse AI JSON response", responseText);
                return { 
                    analysis: "Error al interpretar la respuesta de la IA. Inténtalo de nuevo.", 
                    fixedWorkflow: null,
                    predictedOutcome: "No disponible"
                };
            }

        } catch (error) {
            console.error("Diagnosis Error:", error);
            throw error;
        }
    },

    // Image Generation
    async generateImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") {
        const ai = getAiClient();
        const model = GeminiModel.IMAGE_GEN_PRO;
        try {
            const response = await ai.models.generateContent({
                model,
                contents: { parts: [{ text: prompt }] },
                config: { imageConfig: { aspectRatio, imageSize } }
            });
            return response;
        } catch (error) {
            console.error("Image Gen Error:", error);
            throw error;
        }
    },

    // Image Editing
    async editImage(prompt: string, base64Image: string, mimeType: string) {
        const ai = getAiClient();
        try {
            const response = await ai.models.generateContent({
                model: GeminiModel.IMAGE_GEN_FLASH,
                contents: {
                    parts: [
                        { inlineData: { data: base64Image, mimeType } },
                        { text: prompt }
                    ]
                }
            });
            return response;
        } catch (error) {
            console.error("Image Edit Error:", error);
            throw error;
        }
    },

    // Video Generation (Veo)
    async generateVideo(prompt: string, aspectRatio: string = "16:9") {
        if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
            await window.aistudio.openSelectKey();
        }
        const ai = getAiClient();
        try {
            let operation = await ai.models.generateVideos({
                model: GeminiModel.VEO_FAST,
                prompt,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio as any }
            });
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                operation = await ai.operations.getVideosOperation({ operation });
            }
            const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!videoUri) throw new Error("No video URI returned");
            const res = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
            const blob = await res.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Veo Error:", error);
            throw error;
        }
    },

    // Audio Transcription
    async transcribeAudio(base64Audio: string) {
        const ai = getAiClient();
        try {
            const response = await ai.models.generateContent({
                model: GeminiModel.CHAT_FLASH,
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
                        { text: "Please transcribe this audio exactly." }
                    ]
                }
            });
            return response.text;
        } catch (error) {
            console.error("Transcription Error:", error);
            throw error;
        }
    },

    // Text to Speech
    async speak(text: string) {
        const ai = getAiClient();
        try {
            const response = await ai.models.generateContent({
                model: GeminiModel.TTS,
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                },
            });
            return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (error) {
            console.error("TTS Error:", error);
            throw error;
        }
    }
};