import { FilterButton } from "./FilterButton";
import type { FilterType } from "../types";

interface FiltersProps {
  primaryFilter: FilterType;
  onPrimaryFilterChange: (filter: FilterType) => void;
  subcategoryFilters: string[];
  onSubcategoryFilterChange: (filter: string) => void;
  subcategories: string[];
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
}

export function Filters({
  primaryFilter,
  onPrimaryFilterChange,
  subcategoryFilters,
  onSubcategoryFilterChange,
  subcategories,
  onClearFilters,
}: FiltersProps) {
  const primaryFilters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
    { value: "neutral", label: "Neutral" },
  ];

  return (
    <div className="flex flex-col items-center gap-5 mb-8 max-w-4xl mx-auto">
      {/* Primary Filters */}
      <div className="flex flex-wrap gap-2 justify-center items-center max-w-2xl relative">
        {primaryFilters.map((filter) => (
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
        {/* Separator line */}
        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-15 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
      </div>

      {/* Subcategory Filters */}
      <div className="flex flex-wrap gap-2 justify-center items-center max-w-2xl">
        {subcategories.map((category) => (
          <FilterButton
            key={category}
            filter={category}
            isActive={subcategoryFilters.includes(category)}
            onClick={() => onSubcategoryFilterChange(category)}
            type="subcategory"
          >
            {category}
          </FilterButton>
        ))}
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onClearFilters}
          className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400 text-xs font-medium hover:bg-blue-400 hover:text-neutral-900 hover:border-blue-400 transition-all duration-300"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
