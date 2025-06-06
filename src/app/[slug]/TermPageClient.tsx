"use client";

import { ArrowLeft } from "lucide-react";
import { audioTermTracks } from "@/data/tracksData";
import { TestTracks } from "@/components/TestTracks";
import { termsData } from "@/data";
import type { AudioTerm } from "@/types";

interface TermPageClientProps {
  termData: AudioTerm;
}

export function TermPageClient({ termData: term }: TermPageClientProps) {
  const handleRelatedTermClick = (termOrSearch: string) => {
    // Check if this is an actual term in our dictionary
    const actualTerm = termsData.find(
      (t) => t.term.toLowerCase() === termOrSearch.toLowerCase()
    );

    if (actualTerm) {
      // Navigate to the specific term page
      const slug = actualTerm.term.toLowerCase().replace(/\s+/g, "-");
      if (typeof window !== "undefined") {
        window.location.href = `/${slug}/`;
      }
    } else {
      // Navigate to home page with search query
      const encodedSearch = encodeURIComponent(termOrSearch);
      if (typeof window !== "undefined") {
        window.location.href = `/?search=${encodedSearch}`;
      }
    }
  };

  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      if (
        document.referrer.includes(window.location.origin) &&
        document.referrer !== window.location.href
      ) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  const sentimentClass = term.primaryCategory;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-full h-full bg-gradient-radial from-amber-500/50 via-transparent to-transparent"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute w-full h-full bg-gradient-radial from-neutral-500/50 via-transparent to-transparent"
          style={{
            background:
              "radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.02) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute w-full h-full bg-gradient-radial from-emerald-500/50 via-transparent to-transparent"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.01) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-4xl px-5 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Terms
        </button>

        {/* Term Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-neutral-200">{term.term}</h1>
            <div
              className={`
              w-3 h-3 rounded-full
              ${
                sentimentClass === "positive"
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                  : sentimentClass === "negative"
                  ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                  : "bg-neutral-500 shadow-lg shadow-neutral-300/50"
              }
            `}
            />
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

          <p className="text-lg text-neutral-300 leading-relaxed mb-4">
            {term.summary}
          </p>
        </div>

        {/* Related Terms */}
        {(term.relatedTerms.length > 0 ||
          (term.oppositeTerms && term.oppositeTerms.length > 0)) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {term.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">
                    Similar Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((relatedTerm) => (
                      <button
                        key={relatedTerm}
                        onClick={() => handleRelatedTermClick(relatedTerm)}
                        className="px-2 py-1 border-2 rounded-2xl text-xs font-medium whitespace-nowrap min-h-6 flex items-center transition-all duration-300 cursor-pointer bg-neutral-900 border-emerald-500/30 text-emerald-500/70 hover:border-emerald-500 hover:text-emerald-500"
                      >
                        {relatedTerm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {term.oppositeTerms && term.oppositeTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">
                    Opposite Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.oppositeTerms.map((oppositeTerm) => (
                      <button
                        key={oppositeTerm}
                        onClick={() => handleRelatedTermClick(oppositeTerm)}
                        className="px-2 py-1 border-2 rounded-2xl text-xs font-medium whitespace-nowrap min-h-6 flex items-center transition-all duration-300 cursor-pointer bg-neutral-900 border-amber-500/30 text-amber-500/70 hover:border-amber-500 hover:text-amber-500"
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
              tracks={
                audioTermTracks[term.term as keyof typeof audioTermTracks]
              }
            />
          </div>
        )}

        {/* Short Explanation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">
            Quick Overview
          </h2>
          <div
            className="text-neutral-300 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: term.shortExplanation }}
          />
        </div>

        {/* Detailed Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">
            In Detail
          </h2>
          <div
            className="text-neutral-300 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: term.detailedDescription }}
          />
        </div>
      </div>
    </div>
  );
}
