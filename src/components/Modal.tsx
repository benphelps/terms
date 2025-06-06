import { useEffect } from "react";
import type { AudioTerm } from "../types";
import { audioTermTracks } from "../data/tracksData";
import { TestTracks } from "./TestTracks";

interface ModalProps {
  term: AudioTerm | null;
  searchQuery?: string;
  onClose: () => void;
  onSearchTerm: (term: string) => void;
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

export function Modal({
  term,
  searchQuery = "",
  onClose,
  onSearchTerm,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (term) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [term, onClose]);

  if (!term) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleRelatedTermClick = (relatedTerm: string) => {
    onClose();
    onSearchTerm(relatedTerm);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] p-5 overflow-y-auto flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-neutral-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700 shadow-2xl modal-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-800 p-8 border-b border-neutral-700 z-10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-neutral-200 text-lg hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <i className="fas fa-times"></i>
          </button>

          <h2
            className="text-3xl font-semibold mb-4 text-neutral-200"
            dangerouslySetInnerHTML={{
              __html: highlightText(term.term, searchQuery, "modal-highlight"),
            }}
          />

          <div className="flex flex-wrap gap-1.5">
            <span
              className={`
              text-xs px-2.5 py-1 rounded-xl border
              ${
                term.primaryCategory === "positive"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : term.primaryCategory === "negative"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"
              }
            `}
            >
              {term.primaryCategory}
            </span>
            {term.subCategories.map((cat, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-neutral-500"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Test Tracks */}
          {audioTermTracks[term.term as keyof typeof audioTermTracks] && (
            <TestTracks tracks={audioTermTracks[term.term as keyof typeof audioTermTracks]} />
          )}

          {/* Top Info Bar */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 ${!audioTermTracks[term.term as keyof typeof audioTermTracks] ? 'border-b border-neutral-700' : ''}`}>
            {/* Related Terms */}
            {term.relatedTerms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 text-[#e0e0e0]">
                  Related Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((relatedTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRelatedTermClick(relatedTerm)}
                      className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-xs hover:bg-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    >
                      {relatedTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opposite Terms */}
            {term.oppositeTerms && term.oppositeTerms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 text-[#e0e0e0]">
                  Opposite Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {term.oppositeTerms.map((oppositeTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRelatedTermClick(oppositeTerm)}
                      className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500 text-xs hover:bg-amber-500/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    >
                      {oppositeTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Range */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-neutral-200">
                Technical Range
              </h3>
              <p
                className="text-neutral-400 text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    term.technicalRange,
                    searchQuery,
                    "modal-highlight"
                  ),
                }}
              />
            </div>
          </div>

          {/* Text Sections */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-neutral-200 flex items-center gap-2.5">
              Summary
            </h3>
            <p
              className="text-neutral-400 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightText(
                  term.summary,
                  searchQuery,
                  "modal-highlight"
                ),
              }}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-neutral-200 flex items-center gap-2.5">
              Short Explanation
            </h3>
            <p
              className="text-neutral-400 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightText(
                  term.shortExplanation,
                  searchQuery,
                  "modal-highlight"
                ),
              }}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[#e0e0e0] flex items-center gap-2.5">
              Detailed Description
            </h3>
            <p
              className="text-[#a0a0a0] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightText(
                  term.detailedDescription,
                  searchQuery,
                  "modal-highlight"
                ),
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
