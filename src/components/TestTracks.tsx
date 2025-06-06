import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrackRow } from "./TrackRow";

interface TestTracksProps {
  tracks: string[];
}

export function TestTracks({ tracks }: TestTracksProps) {
  const [currentPage, setCurrentPage] = useState(0);
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

  if (tracks.length === 0) return null;

  return (
    <div>
      {/* Header with Pagination */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-neutral-200">Test Tracks</h3>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-neutral-500 min-w-[3rem] text-center">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
