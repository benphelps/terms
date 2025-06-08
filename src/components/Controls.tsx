import { RefObject } from "react";
import { SearchBox } from "@/components/SearchBox";
import { FilterButton } from "@/components/FilterButton";

interface ControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  primaryFilter: "all" | "positive" | "negative" | "neutral";
  onPrimaryFilterChange: (filter: "all" | "positive" | "negative" | "neutral") => void;
  subcategoryFilters: string[];
  allSubcategories: string[];
  onToggleSubcategoryFilter: (category: string) => void;
  onScrollSubcategories: (direction: "left" | "right", isSticky?: boolean) => void;
  subcategoryScrollRef?: RefObject<HTMLDivElement | null>;
  isSticky?: boolean;
}

export function Controls({
  searchQuery,
  onSearchChange,
  onClearFilters,
  primaryFilter,
  onPrimaryFilterChange,
  subcategoryFilters,
  allSubcategories,
  onToggleSubcategoryFilter,
  onScrollSubcategories,
  subcategoryScrollRef,
  isSticky = false,
}: ControlsProps) {
  const buttonBaseClass = isSticky
    ? "w-6 h-6 bg-neutral-800/90 backdrop-blur-sm border border-neutral-600 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/90 transition-colors duration-200"
    : "w-6 h-6 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 rounded-full flex items-center justify-center sm:hidden hover:bg-neutral-700/80 transition-colors duration-200";
  
  const iconClass = isSticky ? "text-neutral-300 text-xs" : "text-neutral-400 text-xs";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* First row: Search + Clear + Sentiment */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <SearchBox value={searchQuery} onChange={onSearchChange} />

          {/* Clear Button */}
          <button
            onClick={onClearFilters}
            className="px-4 py-1 bg-neutral-900 border-2 border-neutral-700 rounded-2xl text-neutral-400 text-sm font-medium hover:bg-blue-400 hover:text-neutral-900 hover:border-blue-400 transition-all duration-300 flex-shrink-0 h-8 flex items-center"
          >
            Clear
          </button>
        </div>

        {/* Primary Filters */}
        <div className="flex flex-wrap gap-1 justify-center items-center">
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
              onClick={() => onPrimaryFilterChange(filter.value)}
              type="primary"
            >
              {filter.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Second row: Subcategory Filters */}
      <div className="relative w-full">
        <div
          ref={subcategoryScrollRef}
          className="flex gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-hide items-center px-8 sm:px-0 sm:justify-center sm:flex-wrap"
        >
          {allSubcategories.map((category) => (
            <FilterButton
              key={category}
              filter={category}
              isActive={subcategoryFilters.includes(category)}
              onClick={() => onToggleSubcategoryFilter(category)}
              type="subcategory"
            >
              {category}
            </FilterButton>
          ))}
        </div>
        {/* Scroll indicators for very small screens only */}
        <button
          onClick={() => onScrollSubcategories("left", isSticky)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 ${buttonBaseClass}`}
        >
          <i className={`fas fa-chevron-left ${iconClass}`}></i>
        </button>
        <button
          onClick={() => onScrollSubcategories("right", isSticky)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 ${buttonBaseClass}`}
        >
          <i className={`fas fa-chevron-right ${iconClass}`}></i>
        </button>
      </div>
    </div>
  );
}