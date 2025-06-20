import { Play, Pause, Loader2, VolumeX } from "lucide-react";
import { useMusicPlayer } from "../hooks/useMusicPlayer";

interface TrackPlayButtonProps {
  track: string;
  className?: string;
}

export function TrackPlayButton({
  track,
  className = "",
}: TrackPlayButtonProps) {
  const {
    playTrack,
    stopTrack,
    isLoading,
    isPlaying,
    currentTrack,
    noPreviewTracks,
  } = useMusicPlayer();

  const isCurrentTrack = currentTrack === track;
  const hasNoPreview = noPreviewTracks.has(track);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasNoPreview) {
      return; // Don't do anything if we know there's no preview
    }

    if (isPlaying && isCurrentTrack) {
      stopTrack();
      return;
    }

    await playTrack(track);
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || hasNoPreview}
      className={`
        relative flex items-center justify-center w-6 h-6 rounded-full overflow-hidden
        ${
          hasNoPreview
            ? "bg-red-500/10 border-red-500/30 cursor-not-allowed"
            : "bg-white/10 hover:bg-white/20 border border-white/20 hover:scale-105"
        }
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={
        hasNoPreview
          ? "No preview available"
          : isLoading
          ? "Searching..."
          : `Play ${track}`
      }
    >

      {/* Icon */}
      <div className="relative z-5">
        {hasNoPreview ? (
          <VolumeX className="w-3 h-3 text-red-400" />
        ) : isLoading && isCurrentTrack ? (
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        ) : isPlaying && isCurrentTrack ? (
          <Pause className="w-3 h-3 text-white" />
        ) : (
          <Play className="w-3 h-3 text-white ml-0.5" />
        )}
      </div>
    </button>
  );
}
