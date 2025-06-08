import { TrackPlayButton } from "./TrackPlayButton";
import { useMusicPlayer } from "../hooks/useMusicPlayer";

interface TrackRowProps {
  track: string;
  searchQuery?: string;
  hasTrackMatch?: boolean;
}

function highlightText(
  text: string,
  query: string = "",
  className: string = ""
): string {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(safeQuery, "gi"),
    (match) =>
      `<mark${className ? ` class="${className}"` : ""}>${match}</mark>`
  );
}

export function TrackRow({
  track,
  searchQuery = "",
  hasTrackMatch = false,
}: TrackRowProps) {
  const { currentTrack, progress, duration } = useMusicPlayer();

  const isCurrentTrack = currentTrack === track;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = isCurrentTrack ? progress : 0;
  const totalTime = isCurrentTrack ? duration : 30; // Default to 30 seconds

  const handleExternalLink = (service: string) => {
    const query = encodeURIComponent(track);
    const urls = {
      youtube: `https://music.youtube.com/search?q=${query}`,
      apple: `https://music.apple.com/search?term=${query}`,
      spotify: `https://open.spotify.com/search/${query}`,
      tidal: `https://tidal.com/browse/search?q=${query}`,
    };
    window.open(urls[service as keyof typeof urls], "_blank");
  };

  return (
    <div className="relative overflow-hidden rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800/80 transition-colors">
      {/* Progress background */}
      {isCurrentTrack && (
        <div
          className="absolute inset-0 bg-emerald-500/5 border-r border-r-emerald-500/10 transition-all duration-100 rounded-l-lg"
          style={{
            width: `${progressPercent}%`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-between px-3 py-2">
        <span
          className="text-neutral-300 text-sm font-medium truncate mr-3"
          dangerouslySetInnerHTML={{
            __html: hasTrackMatch
              ? highlightText(track, searchQuery, "modal-highlight")
              : track,
          }}
        />

        <div className="flex items-center gap-3">
          {/* Show time when playing, platform links when not */}
          {isCurrentTrack ? (
            <div className="text-xs text-neutral-400 font-mono">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleExternalLink("youtube")}
                className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-red-500 transition-colors rounded"
                title="Search on YouTube Music"
              >
                <i className="fab fa-youtube text-sm"></i>
              </button>

              <button
                onClick={() => handleExternalLink("apple")}
                className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors rounded"
                title="Search on Apple Music"
              >
                <i className="fab fa-apple text-sm"></i>
              </button>

              <button
                onClick={() => handleExternalLink("spotify")}
                className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-green-500 transition-colors rounded"
                title="Search on Spotify"
              >
                <i className="fab fa-spotify text-sm"></i>
              </button>

              <button
                onClick={() => handleExternalLink("tidal")}
                className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-blue-400 transition-colors rounded"
                title="Search on Tidal"
              >
                <span className="text-sm font-bold">T</span>
              </button>
            </div>
          )}

          <TrackPlayButton track={track} />
        </div>
      </div>
    </div>
  );
}
