import { supabase } from './supabaseClient';
import { AISettings } from '../types';

export const defaultAISettings: AISettings = {
  provider: 'gemini',
  apiKey: '',
  endpoint: 'https://api.poixe.com/v1', // Updated to Poixe default with v1
  model: 'gemini-3-flash-preview',
  systemPrompt: 'You are the Spirit of the Class of 2026. You are nostalgic, funny, and optimistic. You remember all the inside jokes of the class. Keep answers concise and witty.',
};

export const fetchAISettings = async (): Promise<AISettings> => {
  try {
    // Fetch all settings
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;

    if (data && data.length > 0) {
      const settings: any = { ...defaultAISettings };
      // Map rows (key, value) to object
      data.forEach((row: any) => {
        // Only map keys that exist in our settings type to avoid polluting it with other keys (like admin_password)
        if (Object.keys(defaultAISettings).includes(row.key)) {
            settings[row.key] = row.value;
        }
      });
      return settings as AISettings;
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
  return defaultAISettings;
};

// Helper to fetch a specific setting (like the password)
export const fetchSettingValue = async (key: string): Promise<string | null> => {
    try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', key).single();
        return data?.value || null;
    } catch (e) {
        return null;
    }
}

export const saveAISettings = async (settings: AISettings) => {
  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value
  }));
  
  const { error } = await supabase.from('site_settings').upsert(updates);
  return error;
};