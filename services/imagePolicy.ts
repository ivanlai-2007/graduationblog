/** Only render bundled images or images stored in this project's Supabase Storage. */
export function isManagedImage(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    const storageOrigin = new URL(import.meta.env.VITE_SUPABASE_URL || 'https://nsblhtgprhjkugoqqdtg.supabase.co').origin;
    return parsed.origin === window.location.origin || (parsed.origin === storageOrigin && parsed.pathname.startsWith('/storage/v1/object/public/'));
  } catch { return false; }
}
