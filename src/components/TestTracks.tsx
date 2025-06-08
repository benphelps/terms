import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TrackRow } from "./TrackRow";

interface TestTracksProps {
  tracks: string[];
  searchQuery?: string;
  hasTrackMatch?: boolean;
}

export function TestTracks({
  tracks,
  searchQuery = "",
  hasTrackMatch = false,
}: TestTracksProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeOnMobile, setShowVolumeOnMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0.5);
  const [hasHydrated, setHasHydrated] = useState(false);
  const volumeAreaRef = useRef<HTMLDivElement>(null);
  const closeVolumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const scheduleVolumeClose = useCallback(() => {
    if (closeVolumeTimeoutRef.current) {
      clearTimeout(closeVolumeTimeoutRef.current);
    }
    closeVolumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeOnMobile(false);
    }, 3000); // Close after 3 seconds
  }, []);

  const handleVolumeClick = () => {
    if (isMobile) {
      // Mobile: toggle volume control visibility
      const newState = !showVolumeOnMobile;
      setShowVolumeOnMobile(newState);

      // If opening volume control, schedule auto-close
      if (newState) {
        scheduleVolumeClose();
      } else {
        // If manually closing, clear the timeout
        if (closeVolumeTimeoutRef.current) {
          clearTimeout(closeVolumeTimeoutRef.current);
        }
      }
    } else {
      // Desktop: toggle mute
      if (isMuted) {
        // Unmute: restore previous volume
        updateVolume(volumeBeforeMute);
        setIsMuted(false);
      } else {
        // Mute: save current volume and set to 0
        setVolumeBeforeMute(volume);
        if (typeof window !== "undefined") {
          localStorage.setItem("audioVolumeBeforeMute", volume.toString());
        }
        updateVolume(0);
        setIsMuted(true);
      }
    }
  };

  const updateVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      setVolume(clampedVolume);

      // Save volume to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("audioVolume", clampedVolume.toString());
      }

      // Update mute state based on volume
      if (clampedVolume === 0 && !isMuted) {
        setIsMuted(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("audioMuted", "true");
        }
      } else if (clampedVolume > 0 && isMuted) {
        setIsMuted(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("audioMuted", "false");
        }
      }

      // Update global audio volume if audio is playing
      if (typeof window !== "undefined") {
        const globalWindow = window as typeof window & {
          getGlobalAudioState?: () => { audio: HTMLAudioElement } | null;
        };
        if (globalWindow.getGlobalAudioState) {
          const audioState = globalWindow.getGlobalAudioState();
          if (audioState?.audio) {
            audioState.audio.volume = clampedVolume;
          }
        }
      }

      // On mobile, if volume control is open and user adjusts volume, reset the close timer
      if (isMobile && showVolumeOnMobile) {
        scheduleVolumeClose();
      }
    },
    [isMuted, isMobile, showVolumeOnMobile, scheduleVolumeClose]
  );

  const getVolumeIcon = () => {
    // Use default icon until hydrated to prevent mismatch
    if (!hasHydrated) return <Volume2 className="w-4 h-4" />;

    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.33) return <Volume className="w-4 h-4" />;
    if (volume < 0.66) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  // Load saved volume settings after hydration
  useEffect(() => {
    const savedVolume = localStorage.getItem("audioVolume");
    const savedMuted = localStorage.getItem("audioMuted");
    const savedVolumeBeforeMute = localStorage.getItem("audioVolumeBeforeMute");

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === "true");
    if (savedVolumeBeforeMute)
      setVolumeBeforeMute(parseFloat(savedVolumeBeforeMute));

    setHasHydrated(true);
  }, []);

  // Detect mobile devices on client side
  useEffect(() => {
    setIsMobile("ontouchstart" in window);
  }, []);

  // Handle mouse wheel scrolling in volume control area
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (
        volumeAreaRef.current &&
        volumeAreaRef.current.contains(e.target as Node)
      ) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05; // Reverse direction for intuitive scrolling
        updateVolume(volume + delta);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [volume, updateVolume]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeVolumeTimeoutRef.current) {
        clearTimeout(closeVolumeTimeoutRef.current);
      }
    };
  }, []);

  if (tracks.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-neutral-200">Test Tracks</h2>
        <p className="text-xs text-neutral-500">
          Music tracks that demonstrate this audio characteristic
        </p>
      </div>

      {/* Track List */}
      <div className="grid gap-2 mb-4">
        {currentTracks.map((track, index) => (
          <TrackRow
            key={startIndex + index}
            track={track}
            searchQuery={searchQuery}
            hasTrackMatch={hasTrackMatch}
          />
        ))}
      </div>

      {/* Controls at bottom */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          {/* Volume Control */}
          <div className="relative flex items-center group" ref={volumeAreaRef}>
            <button
              onClick={handleVolumeClick}
              className="w-8 h-8 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label={
                isMobile
                  ? "Volume control"
                  : !hasHydrated
                  ? "Volume"
                  : isMuted
                  ? "Unmute"
                  : "Mute"
              }
            >
              {getVolumeIcon()}
            </button>

            <div
              className={`absolute left-8 -bottom-0.5 flex items-center gap-3 min-w-[140px] transition-all duration-200 px-3 py-2 ${
                isMobile
                  ? showVolumeOnMobile
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              }`}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-neutral-400 min-w-[2.5rem]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
