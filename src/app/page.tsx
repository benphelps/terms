"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { TermCard } from "@/components/TermCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { Modal } from "@/components/Modal";
import { Controls } from "@/components/Controls";
import { useSearch } from "@/hooks/useSearch";
import { useFilters } from "@/hooks/useFilters";
import { termsData } from "@/data";
import type { AudioTerm } from "@/types";

export default function HomePage() {
  const [isFiltersSticky, setIsFiltersSticky] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<AudioTerm | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const filtersPlaceholderRef = useRef<HTMLDivElement>(null);
  const subcategoryScrollRef = useRef<HTMLDivElement>(null);
  const stickySubcategoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollSubcategories = (
    direction: "left" | "right",
    isSticky = false
  ) => {
    const scrollContainer = isSticky
      ? stickySubcategoryScrollRef.current
      : subcategoryScrollRef.current;
    if (!scrollContainer) return;

    const scrollAmount = 200; // pixels to scroll
    const currentScroll = scrollContainer.scrollLeft;
    const targetScroll =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const { searchQuery, setSearchQuery, searchResults, searchMatches, hasSearchQuery } =
    useSearch(termsData);

  // Check for search parameter and term slug in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search");

      if (searchParam) {
        setSearchQuery(searchParam);
      }

      // Term pages are now handled by [slug]/page.tsx, so we only handle homepage here
    }
  }, [setSearchQuery]);

  const {
    primaryFilter,
    setPrimaryFilter,
    subcategoryFilters,
    toggleSubcategoryFilter,
    allSubcategories,
    filteredTerms,
    clearFilters,
  } = useFilters(termsData);

  // Determine which terms to display
  const displayTerms = useMemo(() => {
    if (hasSearchQuery) {
      // If there's a search query, filter search results by current filters
      let filtered = [...searchResults];

      if (primaryFilter !== "all") {
        filtered = filtered.filter(
          (term) => term.primaryCategory === primaryFilter
        );
      }

      if (subcategoryFilters.length > 0) {
        filtered = filtered.filter((term) =>
          subcategoryFilters.some((filter) =>
            term.subCategories.includes(filter)
          )
        );
      }

      return filtered;
    }

    // If no search query, use filtered terms
    return filteredTerms;
  }, [
    hasSearchQuery,
    searchResults,
    filteredTerms,
    primaryFilter,
    subcategoryFilters,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    clearFilters();
  };

  const handleOpenTerm = (term: AudioTerm) => {
    setIsTransitioning(true);
    // Brief fade out
    setTimeout(() => {
      setSelectedTerm(term);
      const slug = term.term.toLowerCase().replace(/\s+/g, "-");
      if (typeof window !== "undefined") {
        // Update URL to clean path
        window.history.pushState({}, "", `/${slug}`);
      }
      // Fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleCloseModal = () => {
    setIsTransitioning(true);
    // Brief fade out
    setTimeout(() => {
      setSelectedTerm(null);
      if (typeof window !== "undefined") {
        // Go back to homepage
        window.history.pushState({}, "", "/");
      }
      // Fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleSearchFromModal = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    if (typeof window !== "undefined") {
      if (searchTerm) {
        window.history.pushState(
          {},
          "",
          `/?search=${encodeURIComponent(searchTerm)}`
        );
      } else {
        window.history.pushState({}, "", "/");
      }
    }
  };


  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        setIsTransitioning(true);
        // Brief fade out
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const searchParam = urlParams.get("search");

          // Term pages are now handled by [slug]/page.tsx
          // Homepage only handles search and modal state
          setSelectedTerm(null);

          // Handle search
          if (searchParam) {
            setSearchQuery(searchParam);
          } else {
            setSearchQuery("");
          }
          
          // Fade back in
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 150);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setSearchQuery]);

  // Sticky filters logic
  useEffect(() => {
    const handleScroll = () => {
      if (filtersPlaceholderRef.current) {
        const rect = filtersPlaceholderRef.current.getBoundingClientRect();
        // Only show sticky when the entire filter container has scrolled out of view
        setIsFiltersSticky(rect.bottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className={`min-h-screen w-full bg-neutral-950 text-neutral-200 pb-10 overflow-x-hidden transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-5 pt-8 relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold pb-2.5 bg-gradient-to-br from-emerald-500 to-amber-500 bg-clip-text text-transparent">
            Audiophile Terminology Guide
          </h1>
          <p className="text-neutral-400 text-lg">
            Explore the language of audio with interactive charts and curated examples
          </p>
        </header>
      </div>

      {/* Controls */}
      <div
        ref={filtersPlaceholderRef}
        className={`relative z-10 ${selectedTerm ? "hidden" : ""}`}
      >
        <div className="container mx-auto max-w-6xl px-5">
          <div className="p-6 pt-0 relative">
            <Controls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
              primaryFilter={primaryFilter}
              onPrimaryFilterChange={setPrimaryFilter}
              subcategoryFilters={subcategoryFilters}
              allSubcategories={allSubcategories}
              onToggleSubcategoryFilter={toggleSubcategoryFilter}
              onScrollSubcategories={scrollSubcategories}
              subcategoryScrollRef={subcategoryScrollRef}
            />
          </div>
        </div>
      </div>

      {/* Sticky Controls - slides up from bottom when original is out of view */}
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/40 rounded-lg z-50 shadow-lg transition-transform duration-300 ease-out ${
          isFiltersSticky && !selectedTerm
            ? "translate-y-0"
            : "translate-y-[-100%]"
        }`}
        style={{ width: "calc(100% - 40px)", maxWidth: "1152px" }}
      >
        <div className="p-6">
          <Controls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
            primaryFilter={primaryFilter}
            onPrimaryFilterChange={setPrimaryFilter}
            subcategoryFilters={subcategoryFilters}
            allSubcategories={allSubcategories}
            onToggleSubcategoryFilter={toggleSubcategoryFilter}
            onScrollSubcategories={scrollSubcategories}
            subcategoryScrollRef={stickySubcategoryScrollRef}
            isSticky={true}
          />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-5 relative z-10">
        {/* Frequency Chart */}
        <FrequencyChart
          terms={displayTerms}
          onTermClick={handleOpenTerm}
          selectedTerm={null}
        />

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayTerms.map((term) => (
            <TermCard
              key={term.term}
              term={term}
              searchQuery={searchQuery}
              searchMatches={searchMatches[term.term]}
              onOpenModal={handleOpenTerm}
            />
          ))}
        </div>

        {displayTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">
              No terms found matching your criteria.
            </p>
            {(hasSearchQuery ||
              primaryFilter !== "all" ||
              subcategoryFilters.length > 0) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-emerald-500 text-neutral-900 rounded-full hover:bg-emerald-600 transition-colors duration-300"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          term={selectedTerm}
          searchQuery={searchQuery}
          searchMatches={searchMatches}
          onClose={handleCloseModal}
          onSearchTerm={handleSearchFromModal}
          onOpenTerm={handleOpenTerm}
          termsData={termsData}
        />
      </div>
    </div>
  );
}
