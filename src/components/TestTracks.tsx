import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { TrackRow } from "./TrackRow";

interface TestTracksProps {
  tracks: string[];
}

export function TestTracks({ tracks }: TestTracksProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeOnMobile, setShowVolumeOnMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0.5);
  const volumeAreaRef = useRef<HTMLDivElement>(null);
  const tracksPerPage = 3;
  const totalPages = Math.ceil(tracks.length / tracksPerPage);

  const startIndex = currentPage * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const currentTracks = tracks.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    updateVolume(newVolume);
  };

  const handleVolumeClick = () => {
    if (isMobile) {
      // Mobile: toggle volume control visibility
      setShowVolumeOnMobile(!showVolumeOnMobile);
    } else {
      // Desktop: toggle mute
      if (isMuted) {
        // Unmute: restore previous volume
        updateVolume(volumeBeforeMute);
        setIsMuted(false);
      } else {
        // Mute: save current volume and set to 0
        setVolumeBeforeMute(volume);
        updateVolume(0);
        setIsMuted(true);
      }
    }
  };

  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    // Update mute state based on volume
    if (clampedVolume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    
    // Update global audio volume if audio is playing
    if (typeof window !== 'undefined') {
      const globalWindow = window as typeof window & { getGlobalAudioState?: () => { audio: HTMLAudioElement } | null };
      if (globalWindow.getGlobalAudioState) {
        const audioState = globalWindow.getGlobalAudioState();
        if (audioState?.audio) {
          audioState.audio.volume = clampedVolume;
        }
      }
    }
  }, [isMuted]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.33) return <Volume className="w-4 h-4" />;
    if (volume < 0.66) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  // Detect mobile devices on client side
  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  // Handle mouse wheel scrolling in volume control area
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (volumeAreaRef.current && volumeAreaRef.current.contains(e.target as Node)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05; // Reverse direction for intuitive scrolling
        updateVolume(volume + delta);
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [volume, updateVolume]);

  if (tracks.length === 0) return null;

  return (
    <div>
      {/* Header with Pagination */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-neutral-200">Test Tracks</h2>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <div className="flex items-center group" ref={volumeAreaRef}>
              <div className={`flex items-center gap-2 mr-2 min-w-[120px] transition-all duration-200 ${
                isMobile 
                  ? (showVolumeOnMobile ? 'opacity-100 visible' : 'opacity-0 invisible w-0 overflow-hidden')
                  : 'opacity-0 invisible w-0 overflow-hidden group-hover:opacity-100 group-hover:visible group-hover:w-auto'
              }`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-neutral-400 min-w-[2rem]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              
              <button
                onClick={handleVolumeClick}
                className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 transition-colors"
                aria-label={isMobile ? "Volume control" : (isMuted ? "Unmute" : "Mute")}
              >
                {getVolumeIcon()}
              </button>
            </div>

            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page of test tracks"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-neutral-400 min-w-[3rem] text-center">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page of test tracks"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Track List */}
      <div className="grid gap-2">
        {currentTracks.map((track, index) => (
          <TrackRow key={startIndex + index} track={track} />
        ))}
      </div>
    </div>
  );
}
