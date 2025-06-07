import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import type { AudioTerm } from "../types";

interface TermCardProps {
  term: AudioTerm;
  searchQuery?: string;
  isExpanded: boolean;
  onOpenModal: (term: AudioTerm) => void;
  onExpand: (termId: string) => void;
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
  isExpanded,
  onOpenModal,
  onExpand,
}: TermCardProps) {
  const expandedTextRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    // On desktop, if card is already expanded (hover or click), go directly to term page
    // On mobile, use the original two-click behavior
    if ('ontouchstart' in window) {
      // Mobile: two-click behavior
      if (isExpanded) {
        onOpenModal(term);
      } else {
        onExpand(term.term);
      }
    } else {
      // Desktop: one-click behavior (card is already expanded on hover)
      onOpenModal(term);
    }
  };

  const handleMouseEnter = () => {
    // Only expand on hover for desktop (non-touch devices)
    if (!("ontouchstart" in window)) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Add delay before expanding
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 300); // 300ms delay
    }
  };

  const handleMouseLeave = () => {
    // Only collapse on hover leave for desktop
    if (typeof window !== 'undefined' && !("ontouchstart" in window)) {
      // Clear the timeout if user leaves before expansion
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      setIsHovered(false);
    }
  };

  // Use local hover state for expansion on desktop, click state for mobile
  const shouldExpand =
    (typeof window !== 'undefined' && "ontouchstart" in window) ? isExpanded : isExpanded || isHovered;

  const handleScroll = () => {
    if (expandedTextRef.current) {
      const { scrollTop } = expandedTextRef.current;
      if (scrollTop > 5) {
        expandedTextRef.current.classList.add("scrolled");
      } else {
        expandedTextRef.current.classList.remove("scrolled");
      }
    }
  };

  useEffect(() => {
    if (shouldExpand && expandedTextRef.current) {
      const element = expandedTextRef.current;
      element.addEventListener("scroll", handleScroll);
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [shouldExpand]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const sentimentClass = term.primaryCategory;
  const termSlug = generateSlug(term.term);

  return (
    <div
      className={`
        relative cursor-pointer group
        transition-all duration-500 ease-in-out hover:shadow-lg hover:-translate-y-0.5
        ${shouldExpand ? "scale-[1.02]" : "scale-100"}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient border background */}
      <div
        className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 ease-in-out
        ${shouldExpand || "group-hover:opacity-100"}
        ${shouldExpand ? "opacity-100" : ""}
        animated-border-${sentimentClass}
      `}
      />

      {/* Card content */}
      <div
        className={`
        relative bg-neutral-900 border border-neutral-800 rounded-[15px] p-6 flex flex-col
        m-[1px] h-[calc(100%-2px)]
        ${shouldExpand ? "bg-neutral-700 border-transparent" : ""}
        transition-all duration-500 ease-in-out
      `}
      >
        {/* Subtle background glow */}
        <div
          className={`
          absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 ease-in-out
          ${shouldExpand || "group-hover:opacity-100"}
          ${shouldExpand ? "opacity-100" : ""}
          card-glow-${sentimentClass}
        `}
        />

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

        {/* Short explanation (shown when expanded) */}
        <div
          className={`
            relative border-t border-neutral-700 pt-4 mt-0 z-10 overflow-hidden
            transition-all duration-500 ease-in-out
            ${
              shouldExpand
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 pt-0 border-transparent"
            }
          `}
        >
          <div ref={expandedTextRef} className="expanded-text-container">
            <p
              className="text-neutral-400 text-sm leading-relaxed pr-2"
              dangerouslySetInnerHTML={{
                __html: highlightText(term.shortExplanation, searchQuery),
              }}
            />
            <div className="expanded-text-fade" />
          </div>
        </div>

        {/* Divider between content and tags */}
        <div
          className={`
            transition-all duration-500 ease-in-out
            ${
              shouldExpand
                ? "mt-4 mb-1 opacity-100"
                : "mt-0 mb-0 opacity-0 border-transparent"
            }
          `}
        />

        {/* Tags */}
        <div className="relative flex flex-wrap gap-1.5 mt-auto z-10">
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
