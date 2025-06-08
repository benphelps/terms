import Link from "next/link";
import type { AudioTerm } from "../types";

interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

interface TermCardProps {
  term: AudioTerm;
  searchQuery?: string;
  searchMatches?: SearchMatch[];
  onOpenModal: (term: AudioTerm) => void;
}

function highlightText(text: string, query: string = ""): string {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(safeQuery, "gi"),
    (match) => `<mark>${match}</mark>`
  );
}

function generateSlug(term: string): string {
  return term.toLowerCase().replace(/\s+/g, '-');
}

export function TermCard({
  term,
  searchQuery = "",
  searchMatches = [],
  onOpenModal,
}: TermCardProps) {
  const handleClick = () => {
    onOpenModal(term);
  };

  const sentimentClass = term.primaryCategory;
  const termSlug = generateSlug(term.term);

  // Get field names that were matched in search
  const getMatchedFields = () => {
    if (!searchMatches.length) return { displayFields: [], hiddenCount: 0 };
    
    const fieldLabels: Record<string, string> = {
      'term': 'Name',
      'summary': 'Summary', 
      'shortExplanation': 'Description',
      'detailedDescription': 'Details',
      'productNames': 'Products',
      'trackInfo': 'Tracks',
      'subCategories': 'Categories'
    };
    
    const allFields = searchMatches
      .map(match => fieldLabels[match.key] || match.key)
      .filter(Boolean);
    
    if (allFields.length <= 2) {
      return { displayFields: allFields, hiddenCount: 0 };
    }
    
    return { 
      displayFields: allFields.slice(0, 2), 
      hiddenCount: allFields.length - 2 
    };
  };

  const { displayFields: matchedFields, hiddenCount } = getMatchedFields();

  return (
    <div
      className="relative cursor-pointer group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      onClick={handleClick}
    >
      {/* Animated gradient border background */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 animated-border-${sentimentClass}`} />

      {/* Card content */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-[15px] p-6 flex flex-col m-[1px] h-[calc(100%-2px)]">
        {/* Subtle background glow */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 card-glow-${sentimentClass}`} />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-3 z-10">
          <h2 className="text-xl font-semibold text-neutral-200">
            <Link
              href={`/${termSlug}`}
              className="hover:text-neutral-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
              dangerouslySetInnerHTML={{
                __html: highlightText(term.term, searchQuery),
              }}
            />
          </h2>
          <div
            className={`
            w-2 h-2 rounded-full opacity-80
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

        {/* Summary */}
        <p
          className="relative text-neutral-400 text-sm leading-relaxed mb-4 flex-1 z-10"
          dangerouslySetInnerHTML={{
            __html: highlightText(term.summary, searchQuery),
          }}
        />

        {/* Tags */}
        <div className="relative flex flex-wrap gap-1.5 mt-auto z-10">
          {/* Show matched fields first when there's a search */}
          {matchedFields.length > 0 && (
            <>
              {matchedFields.map((field, index) => (
                <span
                  key={`match-${index}`}
                  className="text-xs px-2.5 py-1 bg-blue-500/20 border border-blue-400/40 rounded-xl text-blue-300 font-medium flex items-center gap-1"
                >
                  <i className="fas fa-search text-xs"></i> {field}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span
                  className="text-xs px-2.5 py-1 bg-blue-500/20 border border-blue-400/40 rounded-xl text-blue-300 font-medium"
                >
                  +{hiddenCount} more
                </span>
              )}
            </>
          )}
          
          {/* Regular tags */}
          {term.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-neutral-500"
              dangerouslySetInnerHTML={{
                __html: highlightText(tag, searchQuery),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
