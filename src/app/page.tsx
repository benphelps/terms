"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { SearchBox } from "@/components/SearchBox";
import { FilterButton } from "@/components/FilterButton";
import { TermCard } from "@/components/TermCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { useSearch } from "@/hooks/useSearch";
import { useFilters } from "@/hooks/useFilters";
import { termsData } from "@/data";
import type { AudioTerm } from "@/types";

export default function HomePage() {
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const [isFiltersSticky, setIsFiltersSticky] = useState(false);
  const filtersPlaceholderRef = useRef<HTMLDivElement>(null);

  const { searchQuery, setSearchQuery, searchResults, hasSearchQuery } =
    useSearch(termsData);

  // Check for search parameter in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
        // Clear the URL parameter after setting the search
        window.history.replaceState({}, "", "/");
      }
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
    const slug = term.term.toLowerCase().replace(/\s+/g, "-");
    if (typeof window !== "undefined") {
      window.location.href = `/${slug}`;
    }
  };

  const handleCardExpand = (termId: string) => {
    setExpandedTermId(expandedTermId === termId ? null : termId);
  };

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
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 pb-10">
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

      <div className="container mx-auto max-w-[1400px] px-5 pt-8 relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold pb-2.5 bg-gradient-to-br from-emerald-500 to-amber-500 bg-clip-text text-transparent">
            Audiophile Terminology Guide
          </h1>
          <p className="text-neutral-400 text-lg">
            Interactive reference for audio enthusiasts
          </p>
        </header>
      </div>

      {/* Controls */}
      <div ref={filtersPlaceholderRef} className="relative z-10">
        <div className="container mx-auto max-w-[1400px] px-5">
          <div className="p-6 pt-0 relative">
            <div className="flex flex-col gap-4 w-full">
              {/* First row: Search + Clear + Sentiment */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <SearchBox value={searchQuery} onChange={setSearchQuery} />

                  {/* Clear Button */}
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-1 bg-neutral-900 border-2 border-neutral-700 rounded-2xl text-neutral-400 text-sm font-medium hover:bg-blue-400 hover:text-neutral-900 hover:border-blue-400 transition-all duration-300 flex-shrink-0 h-8 flex items-center"
                  >
                    Clear
                  </button>
                </div>

                {/* Primary Filters */}
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {[
                    { value: "all" as const, label: "All" },
                    { value: "positive" as const, label: "Positive" },
                    { value: "negative" as const, label: "Negative" },
                    { value: "neutral" as const, label: "Neutral" },
                  ].map((filter) => (
                    <FilterButton
                      key={filter.value}
                      filter={filter.value}
                      isActive={primaryFilter === filter.value}
                      onClick={() => setPrimaryFilter(filter.value)}
                      type="primary"
                    >
                      {filter.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Second row: Subcategory Filters */}
              <div className="relative w-full">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-hide items-center px-8 sm:px-0 sm:justify-center sm:flex-wrap">
                  {allSubcategories.map((category) => (
                    <FilterButton
                      key={category}
                      filter={category}
                      isActive={subcategoryFilters.includes(category)}
                      onClick={() => toggleSubcategoryFilter(category)}
                      type="subcategory"
                    >
                      {category}
                    </FilterButton>
                  ))}
                </div>
                {/* Fade gradients for very small screens only */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none sm:hidden"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none sm:hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Controls - slides up from bottom when original is out of view */}
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/40 rounded-lg z-50 shadow-lg transition-transform duration-300 ease-out ${
          isFiltersSticky ? "translate-y-0" : "translate-y-[-100%]"
        }`}
        style={{ width: "calc(100% - 40px)", maxWidth: "1400px" }}
      >
        <div className="p-6">
          <div className="flex flex-col gap-4 w-full">
            {/* First row: Search + Clear + Sentiment */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <SearchBox value={searchQuery} onChange={setSearchQuery} />

                {/* Clear Button */}
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-1 bg-neutral-900 border-2 border-neutral-700 rounded-2xl text-neutral-400 text-sm font-medium hover:bg-blue-400 hover:text-neutral-900 hover:border-blue-400 transition-all duration-300 flex-shrink-0 h-8 flex items-center"
                >
                  Clear
                </button>
              </div>

              {/* Primary Filters */}
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {[
                  { value: "all" as const, label: "All" },
                  { value: "positive" as const, label: "Positive" },
                  { value: "negative" as const, label: "Negative" },
                  { value: "neutral" as const, label: "Neutral" },
                ].map((filter) => (
                  <FilterButton
                    key={filter.value}
                    filter={filter.value}
                    isActive={primaryFilter === filter.value}
                    onClick={() => setPrimaryFilter(filter.value)}
                    type="primary"
                  >
                    {filter.label}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Second row: Subcategory Filters */}
            <div className="relative w-full">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-hide items-center px-8 sm:px-0 sm:justify-center sm:flex-wrap">
                {allSubcategories.map((category) => (
                  <FilterButton
                    key={category}
                    filter={category}
                    isActive={subcategoryFilters.includes(category)}
                    onClick={() => toggleSubcategoryFilter(category)}
                    type="subcategory"
                  >
                    {category}
                  </FilterButton>
                ))}
              </div>
              {/* Fade gradients for very small screens only */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950/80 to-transparent pointer-events-none sm:hidden"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950/80 to-transparent pointer-events-none sm:hidden"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1400px] px-5 relative z-10">
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
              isExpanded={expandedTermId === term.term}
              onOpenModal={handleOpenTerm}
              onExpand={handleCardExpand}
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
      </div>
    </div>
  );
}
