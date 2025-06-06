import { TrackPlayButton } from './TrackPlayButton';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

interface TrackRowProps {
  track: string;
}

export function TrackRow({ track }: TrackRowProps) {
  const { currentTrack, progress, duration } = useMusicPlayer();
  
  const isCurrentTrack = currentTrack === track;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleExternalLink = (service: string) => {
    const query = encodeURIComponent(track);
    const urls = {
      youtube: `https://music.youtube.com/search?q=${query}`,
      apple: `https://music.apple.com/search?term=${query}`,
      spotify: `https://open.spotify.com/search/${query}`,
      tidal: `https://tidal.com/browse/search?q=${query}`
    };
    window.open(urls[service as keyof typeof urls], '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Progress background */}
      {isCurrentTrack && (
        <div 
          className="absolute inset-0 bg-emerald-500/20 transition-all duration-100"
          style={{ 
            width: `${progressPercent}%`
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative flex items-center justify-between px-3 py-2 bg-neutral-700/50 hover:bg-neutral-700 transition-colors">
        <span className="text-neutral-300 text-sm">{track}</span>
        
        <div className="flex items-center gap-2">
          {/* External Links */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExternalLink('youtube')}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
              title="Search on YouTube Music"
            >
              <i className="fab fa-youtube text-xs"></i>
            </button>
            
            <button
              onClick={() => handleExternalLink('apple')}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-gray-300 transition-colors"
              title="Search on Apple Music"
            >
              <i className="fab fa-apple text-xs"></i>
            </button>
            
            <button
              onClick={() => handleExternalLink('spotify')}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-green-500 transition-colors"
              title="Search on Spotify"
            >
              <i className="fab fa-spotify text-xs"></i>
            </button>
            
            <button
              onClick={() => handleExternalLink('tidal')}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-colors"
              title="Search on Tidal"
            >
              <span className="text-xs font-bold">T</span>
            </button>
          </div>
          
          {/* Spacer */}
          <div className="w-px h-4 bg-neutral-600"></div>
          
          <TrackPlayButton track={track} />
        </div>
      </div>
    </div>
  );
}