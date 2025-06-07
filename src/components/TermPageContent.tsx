import Link from "next/link";
import type { AudioTerm } from "../types";
import { audioTermTracks } from "../data/tracksData";
import { audioTermProducts } from "../data/productData";
import { TestTracks } from "./TestTracks";

interface TermPageContentProps {
  term: AudioTerm;
  searchQuery?: string;
  onSearchTerm: (term: string) => void;
  onOpenTerm: (term: AudioTerm) => void;
  termsData: AudioTerm[];
  onBackToHome?: () => void;
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

export function TermPageContent({
  term,
  searchQuery = "",
  onSearchTerm,
  onOpenTerm,
  termsData,
  onBackToHome,
}: TermPageContentProps) {
  const handleRelatedTermClick = (relatedTerm: string) => {
    // Check if this is an actual term in our dictionary
    const actualTerm = termsData.find(
      (t) => t.term.toLowerCase() === relatedTerm.toLowerCase()
    );

    if (actualTerm) {
      // If it's an actual term, open it in the modal
      onOpenTerm(actualTerm);
    } else {
      // If it's not an actual term, search for it
      onSearchTerm(relatedTerm);
    }
  };

  return (
    <>
      {/* Term Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 
              className="text-4xl font-bold text-neutral-200"
              dangerouslySetInnerHTML={{
                __html: highlightText(term.term, searchQuery, "modal-highlight"),
              }}
            />
            <div
              className={`
              w-3 h-3 rounded-full
              ${
                term.primaryCategory === "positive"
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                  : term.primaryCategory === "negative"
                  ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                  : "bg-neutral-500 shadow-lg shadow-neutral-300/50"
              }
            `}
            />
          </div>
          
          {onBackToHome ? (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-200 hover:bg-neutral-700/80 hover:text-white transition-all duration-300 shadow-lg"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-200 hover:bg-neutral-700/80 hover:text-white transition-all duration-300 shadow-lg"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {term.subCategories.map((subcategory) => (
            <span
              key={subcategory}
              className="px-2 py-1 border-2 rounded-2xl text-xs font-medium whitespace-nowrap min-h-6 flex items-center bg-neutral-900 border-neutral-800 text-neutral-400"
            >
              {subcategory}
            </span>
          ))}
        </div>

        <p 
          className="text-lg text-neutral-300 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{
            __html: highlightText(term.summary, searchQuery, "modal-highlight"),
          }}
        />
      </div>

      {/* Related Terms */}
      {(term.relatedTerms.length > 0 ||
        (term.oppositeTerms && term.oppositeTerms.length > 0)) && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {term.relatedTerms.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-neutral-400 mb-3">
                  Similar Concepts
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((relatedTerm) => (
                    <button
                      key={relatedTerm}
                      onClick={() => handleRelatedTermClick(relatedTerm)}
                      className="px-2 py-1 border-2 rounded-2xl text-xs font-medium whitespace-nowrap min-h-6 flex items-center transition-all duration-300 cursor-pointer bg-neutral-900 border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:text-emerald-500"
                    >
                      {relatedTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {term.oppositeTerms && term.oppositeTerms.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-neutral-400 mb-3">
                  Opposite Concepts
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.oppositeTerms.map((oppositeTerm) => (
                    <button
                      key={oppositeTerm}
                      onClick={() => handleRelatedTermClick(oppositeTerm)}
                      className="px-2 py-1 border-2 rounded-2xl text-xs font-medium whitespace-nowrap min-h-6 flex items-center transition-all duration-300 cursor-pointer bg-neutral-900 border-amber-500/30 text-amber-400 hover:border-amber-500 hover:text-amber-500"
                    >
                      {oppositeTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Tracks */}
      {audioTermTracks[term.term as keyof typeof audioTermTracks] && (
        <div className="mb-8">
          <TestTracks
            tracks={audioTermTracks[term.term as keyof typeof audioTermTracks]}
          />
        </div>
      )}

      {/* Example Products */}
      {audioTermProducts[term.term as keyof typeof audioTermProducts] && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-neutral-200">
            Example Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IEMs */}
            {audioTermProducts[term.term as keyof typeof audioTermProducts].iem && 
             audioTermProducts[term.term as keyof typeof audioTermProducts].iem.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-3">In-Ear Monitors</h4>
                <div className="flex flex-wrap gap-2">
                  {audioTermProducts[term.term as keyof typeof audioTermProducts].iem.map((product) => (
                    <span
                      key={product}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-300"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Headphones */}
            {audioTermProducts[term.term as keyof typeof audioTermProducts].headphone && 
             audioTermProducts[term.term as keyof typeof audioTermProducts].headphone.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-3">Headphones</h4>
                <div className="flex flex-wrap gap-2">
                  {audioTermProducts[term.term as keyof typeof audioTermProducts].headphone.map((product) => (
                    <span
                      key={product}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-300"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Short Explanation */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-neutral-200">
          Quick Overview
        </h3>
        <div
          className="text-neutral-300 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: highlightText(term.shortExplanation, searchQuery, "modal-highlight") }}
        />
      </div>

      {/* Detailed Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-neutral-200">
          In Detail
        </h3>
        <div
          className="text-neutral-300 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: highlightText(term.detailedDescription, searchQuery, "modal-highlight") }}
        />
      </div>
    </>
  );
}