'use client';

import { useMemo, useState, useEffect } from "react";
import { SearchBox } from "@/components/SearchBox";
import { Filters } from "@/components/Filters";
import { TermCard } from "@/components/TermCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { useSearch } from "@/hooks/useSearch";
import { useFilters } from "@/hooks/useFilters";
import { termsData } from "@/data";
import type { AudioTerm } from "@/types";

export default function HomePage() {
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const { searchQuery, setSearchQuery, searchResults, hasSearchQuery } =
    useSearch(termsData);
  
  // Check for search parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
        // Clear the URL parameter after setting the search
        window.history.replaceState({}, '', '/');
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
    const slug = term.term.toLowerCase().replace(/\s+/g, '-');
    if (typeof window !== 'undefined') {
      window.location.href = `/${slug}/`;
    }
  };

  const handleCardExpand = (termId: string) => {
    setExpandedTermId(expandedTermId === termId ? null : termId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 overflow-x-hidden">
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

      <div className="container mx-auto max-w-[1400px] px-5 py-5 pt-8 relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold pb-2.5 bg-gradient-to-br from-emerald-500 to-amber-500 bg-clip-text text-transparent">
            Audiophile Terminology Guide
          </h1>
          <p className="text-neutral-400 text-lg">
            Interactive reference for audio enthusiasts
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8">
          <SearchBox value={searchQuery} onChange={setSearchQuery} />

          <Filters
            primaryFilter={primaryFilter}
            onPrimaryFilterChange={setPrimaryFilter}
            subcategoryFilters={subcategoryFilters}
            onSubcategoryFilterChange={toggleSubcategoryFilter}
            subcategories={allSubcategories}
            onClearFilters={handleClearFilters}
            resultsCount={displayTerms.length}
            totalCount={termsData.length}
          />
        </div>

        {/* Frequency Chart */}
        <FrequencyChart
          terms={displayTerms}
          onTermClick={handleOpenTerm}
          selectedTerm={null}
        />

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
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