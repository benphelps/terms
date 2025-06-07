import React, { useState, useCallback, useRef } from 'react';

interface MusicTrack {
  id: number;
  title: string;
  artist: { name: string };
  preview: string;
  duration: number;
}

interface AudioState {
  audio: HTMLAudioElement;
  query: string;
  progress: number;
  duration: number;
}

let globalAudioState: AudioState | null = null;
const progressCallbacks: Set<(query: string, progress: number, duration: number) => void> = new Set();

// Expose global audio state to window for volume control
if (typeof window !== 'undefined') {
  const globalWindow = window as typeof window & { getGlobalAudioState?: () => AudioState | null };
  globalWindow.getGlobalAudioState = () => globalAudioState;
}

export const useMusicPlayer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [noPreviewTracks, setNoPreviewTracks] = useState<Set<string>>(new Set());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback((query: string, prog: number, dur: number) => {
    if (query === currentTrack) {
      setProgress(prog);
      setDuration(dur);
    }
    // If progress is 0 and this was our current track, reset to stopped state
    if (query === currentTrack && prog === 0 && dur === 0) {
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
    }
  }, [currentTrack]);

  // Register/unregister progress callback
  React.useEffect(() => {
    progressCallbacks.add(updateProgress);
    return () => {
      progressCallbacks.delete(updateProgress);
    };
  }, [updateProgress]);

  const searchTrack = async (query: string): Promise<MusicTrack | null> => {
    setIsLoading(true);
    
    try {
      const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`;
      const proxyUrl = `https://whateverorigin.org/get?url=${encodeURIComponent(deezerUrl)}&callback=`;
      
      // Try twice with the CORS proxy
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(proxyUrl);

          if (!response.ok) {
            throw new Error(`Music API error: ${response.status}`);
          }

          const proxyData = await response.json();
          const data = JSON.parse(proxyData.contents);
          
          if (data.data && data.data.length > 0) {
            for (const track of data.data) {
              if (track.preview) {
                return track;
              }
            }
          }

          return null;
        } catch (error) {
          console.log(`Music search attempt ${attempt} failed:`, error);
          
          // If first attempt failed, wait a bit before retry
          if (attempt === 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Both attempts failed
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const playTrack = async (query: string) => {
    // Stop any existing audio and notify all components to reset
    if (globalAudioState) {
      globalAudioState.audio.pause();
      
      // Notify all components that the previous track has stopped
      const previousQuery = globalAudioState.query;
      progressCallbacks.forEach(callback => {
        callback(previousQuery, 0, 0);
      });
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      globalAudioState = null;
    }

    // Reset all track states
    setCurrentTrack(null);
    setProgress(0);
    setDuration(0);

    const track = await searchTrack(query);
    
    if (track?.preview) {
      const audio = new Audio(track.preview);
      audio.volume = 0.7;
      audio.loop = true;
      
      globalAudioState = {
        audio,
        query,
        progress: 0,
        duration: 0
      };

      setCurrentTrack(query);

      audio.addEventListener('loadedmetadata', () => {
        const dur = audio.duration;
        setDuration(dur);
        globalAudioState!.duration = dur;
      });

      audio.addEventListener('ended', () => {
        setCurrentTrack(null);
        setProgress(0);
        setDuration(0);
        globalAudioState = null;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      });

      // Start progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (globalAudioState && !globalAudioState.audio.paused) {
          const currentTime = globalAudioState.audio.currentTime;
          const dur = globalAudioState.duration || globalAudioState.audio.duration;
          
          globalAudioState.progress = currentTime;
          
          // Notify all components
          progressCallbacks.forEach(callback => {
            callback(globalAudioState!.query, currentTime, dur);
          });
        }
      }, 100);

      audio.play().catch(() => {
        setCurrentTrack(null);
        setProgress(0);
        setDuration(0);
        globalAudioState = null;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      });
    } else {
      setNoPreviewTracks(prev => new Set(prev).add(query));
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
    }
  };

  const stopTrack = () => {
    if (globalAudioState) {
      globalAudioState.audio.pause();
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
      globalAudioState = null;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const isPlaying = currentTrack !== null && globalAudioState && !globalAudioState.audio.paused;

  return {
    playTrack,
    stopTrack,
    isLoading,
    isPlaying,
    currentTrack,
    progress,
    duration,
    noPreviewTracks,
  };
};