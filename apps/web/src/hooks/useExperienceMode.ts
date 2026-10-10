'use client';

import { useSyncExternalStore } from 'react';

export type ExperienceMode = 'client' | 'developer';

function subscribeExperience(callback: () => void) {
  window.addEventListener('experience-mode-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('experience-mode-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function getExperienceSnapshot(): ExperienceMode {
  if (typeof window === 'undefined') return 'client';
  return (localStorage.getItem('ub-experience-mode') as ExperienceMode) || 'client';
}

function getServerExperienceSnapshot(): ExperienceMode {
  return 'client';
}

export function useExperienceMode() {
  const mode = useSyncExternalStore(subscribeExperience, getExperienceSnapshot, getServerExperienceSnapshot);

  const setExperienceMode = (nextMode: ExperienceMode) => {
    localStorage.setItem('ub-experience-mode', nextMode);
    document.documentElement.setAttribute('data-experience', nextMode);
    window.dispatchEvent(new CustomEvent('experience-mode-changed', { detail: nextMode }));
    window.dispatchEvent(new Event('storage'));
  };

  return { mode, setExperienceMode };
}
