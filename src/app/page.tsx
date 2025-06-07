"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { SearchBox } from "@/components/SearchBox";
import { FilterButton } from "@/components/FilterButton";
import { TermCard } from "@/components/TermCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { Modal } from "@/components/Modal";
import { useSearch } from "@/hooks/useSearch";
import { useFilters } from "@/hooks/useFilters";
import { termsData } from "@/data";
import type { AudioTerm } from "@/types";

export default function HomePage() {
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const [isFiltersSticky, setIsFiltersSticky] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<AudioTerm | null>(null);
  const filtersPlaceholderRef = useRef<HTMLDivElement>(null);
  const subcategoryScrollRef = useRef<HTMLDivElement>(null);
  const stickySubcategoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollSubcategories = (direction: 'left' | 'right', isSticky = false) => {
    const scrollContainer = isSticky ? stickySubcategoryScrollRef.current : subcategoryScrollRef.current;
    if (!scrollContainer) return;

    const scrollAmount = 200; // pixels to scroll
    const currentScroll = scrollContainer.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : currentScroll + scrollAmount;

    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const { searchQuery, setSearchQuery, searchResults, hasSearchQuery } =
    useSearch(termsData);

  // Check for search parameter and term slug in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search");
      const path = window.location.pathname;
      
      if (searchParam) {
        setSearchQuery(searchParam);
      }
      
      // Check if we're on a term page (any path that's not just "/")
      if (path !== "/" && path !== "") {
        const slug = path.replace("/", "");
        const term = termsData.find(
          t => t.term.toLowerCase().replace(/\s+/g, "-") === slug
        );
        if (term) {
          setSelectedTerm(term);
        }
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
    setSelectedTerm(term);
    const slug = term.term.toLowerCase().replace(/\s+/g, "-");
    if (typeof window !== "undefined") {
      // Update URL to clean path
      window.history.pushState({}, "", `/${slug}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedTerm(null);
    if (typeof window !== "undefined") {
      // Go back to homepage
      window.history.pushState({}, "", "/");
    }
  };

  const handleSearchFromModal = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    if (typeof window !== "undefined") {
      if (searchTerm) {
        window.history.pushState({}, "", `/?search=${encodeURIComponent(searchTerm)}`);
      } else {
        window.history.pushState({}, "", "/");
      }
    }
  };

  const handleCardExpand = (termId: string) => {
    setExpandedTermId(expandedTermId === termId ? null : termId);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get("search");
        const path = window.location.pathname;
        
        // Handle term pages
        if (path !== "/" && path !== "") {
          const slug = path.replace("/", "");
          const term = termsData.find(
            t => t.term.toLowerCase().replace(/\s+/g, "-") === slug
          );
          setSelectedTerm(term || null);
        } else {
          setSelectedTerm(null);
        }
        
        // Handle search
        if (searchParam) {
          setSearchQuery(searchParam);
        } else if (path === "/" || path === "") {
          setSearchQuery("");
        }
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
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 pb-10 overflow-x-hidden">
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
            Interactive reference for audio enthusiasts
          </p>
        </header>
      </div>

      {/* Controls */}
      <div ref={filtersPlaceholderRef} className={`relative z-10 ${selectedTerm ? 'hidden' : ''}`}>
        <div className="container mx-auto max-w-6xl px-5">
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
                <div ref={subcategoryScrollRef} className="flex gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-hide items-center px-8 sm:px-0 sm:justify-center sm:flex-wrap">
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
                {/* Scroll indicators for very small screens only */}
                <button 
                  onClick={() => scrollSubcategories('left', false)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/80 transition-colors duration-200"
                >
                  <i className="fas fa-chevron-left text-neutral-400 text-xs"></i>
                </button>
                <button 
                  onClick={() => scrollSubcategories('right', false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/80 transition-colors duration-200"
                >
                  <i className="fas fa-chevron-right text-neutral-400 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Controls - slides up from bottom when original is out of view */}
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/40 rounded-lg z-50 shadow-lg transition-transform duration-300 ease-out ${
          isFiltersSticky && !selectedTerm ? "translate-y-0" : "translate-y-[-100%]"
        }`}
        style={{ width: "calc(100% - 40px)", maxWidth: "1152px" }}
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
              <div ref={stickySubcategoryScrollRef} className="flex gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-hide items-center px-8 sm:px-0 sm:justify-center sm:flex-wrap">
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
              {/* Scroll indicators for very small screens only */}
              <button 
                onClick={() => scrollSubcategories('left', true)}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-800/90 backdrop-blur-sm border border-neutral-600 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/90 transition-colors duration-200"
              >
                <i className="fas fa-chevron-left text-neutral-300 text-xs"></i>
              </button>
              <button 
                onClick={() => scrollSubcategories('right', true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-800/90 backdrop-blur-sm border border-neutral-600 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/90 transition-colors duration-200"
              >
                <i className="fas fa-chevron-right text-neutral-300 text-xs"></i>
              </button>
            </div>
          </div>
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

        {/* Modal */}
        <Modal
          term={selectedTerm}
          searchQuery={searchQuery}
          onClose={handleCloseModal}
          onSearchTerm={handleSearchFromModal}
          onOpenTerm={handleOpenTerm}
          termsData={termsData}
        />
      </div>
    </div>
  );
}
