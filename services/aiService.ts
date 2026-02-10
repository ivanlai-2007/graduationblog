//developinng 2026_2_10
import { GoogleGenAI } from "@google/genai";
import { fetchAISettings } from "./settingsService";

export const askOracle = async (
  question: string
): Promise<string> => {
  try {
    const settings = await fetchAISettings();

    const systemPrompt = settings.systemPrompt || "You are a helpful assistant.";

    // Strategy 1: Custom Endpoint (OpenAI Compatible)
    if (settings.provider === 'openai') {
        if (!settings.apiKey) throw new Error("Missing API Key for OpenAI provider");
        if (!settings.endpoint) throw new Error("Missing API Endpoint for OpenAI provider");
        
        // Normalize endpoint
        let endpoint = settings.endpoint.trim(); 
        if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
        
        // Basic validation to prevent relative path fetching (which returns index.html)
        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
            throw new Error("API Endpoint must start with http:// or https://");
        }

        // Construct URL: Smartly append /chat/completions if not present
        let url = endpoint;
        if (!url.endsWith('/chat/completions')) {
            url = `${url}/chat/completions`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ],
                stream: false
            })
        });

        // Check content type before parsing JSON
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/json")) {
             const text = await response.text();
             // This usually happens when the URL is 404 (returning HTML page) or behind a proxy returning HTML error
             throw new Error(`Invalid API response (received ${contentType}). The endpoint URL might be incorrect. Expected JSON.`);
        }

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(`API Error: ${errorJson.error?.message || response.statusText}`);
            } catch (e) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        
        // Validate OpenAI response format
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
             throw new Error("Invalid response format: Missing 'choices[0].message' in JSON.");
        }

        return data.choices[0].message.content || "The spirits are silent...";
    } 
    
    // Strategy 2: Official Gemini SDK
    else {
        // Use settings key if available, otherwise fallback to env (development)
        const apiKey = settings.apiKey || process.env.API_KEY;
        if (!apiKey) throw new Error("No API Key configured. Please check Admin settings.");

        const ai = new GoogleGenAI({ apiKey });
        
        // Gemini 2.5/3 uses systemInstruction in config
        const response = await ai.models.generateContent({
            model: settings.model || "gemini-3-flash-preview",
            contents: question,
            config: {
                systemInstruction: systemPrompt
            }
        });
        
        return response.text || "The future is cloudy.";
    }

  } catch (error: any) {
    console.error("Oracle Error:", error);
    return `[System Error] ${error.message || 'Connection failed'}. Please check AI Settings in Admin.`;
  }
};