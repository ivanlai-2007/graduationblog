import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

function readSaved(): string[] {
  try { const value = JSON.parse(localStorage.getItem('time-saved-v1') || '[]'); return Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string').slice(0, 500) : []; } catch { return []; }
}
const ExperienceContext = createContext<{ saved: string[]; toggleSaved: (id: string) => void; motion: boolean; toggleMotion: () => void } | null>(null);
export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState(readSaved);
  const [motion, setMotion] = useState(() => { try { const choice = localStorage.getItem('time-motion'); return choice ? choice === 'on' : !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return true; } });
  useEffect(() => { try { localStorage.setItem('time-saved-v1', JSON.stringify(saved)); } catch { /* Browsing continues without persistence. */ } }, [saved]);
  useEffect(() => { document.documentElement.dataset.motion = motion ? 'on' : 'off'; try { localStorage.setItem('time-motion', motion ? 'on' : 'off'); } catch { /* Optional preference. */ } }, [motion]);
  const toggleSaved = useCallback((id: string) => setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id].slice(-500)), []);
  const toggleMotion = useCallback(() => setMotion(old => !old), []);
  return <ExperienceContext.Provider value={{ saved, toggleSaved, motion, toggleMotion }}>{children}</ExperienceContext.Provider>;
}
export function useExperience() { const context = useContext(ExperienceContext); if (!context) throw new Error('ExperienceProvider missing'); return context; }
