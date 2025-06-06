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
    <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-3 w-full">
      {/* Primary Filters */}
      <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center lg:justify-start items-center">
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
      </div>

      {/* Separator */}
      <div className="hidden lg:block w-px h-5 bg-neutral-700 flex-shrink-0"></div>
      <div className="lg:hidden w-15 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

      {/* Subcategory Filters */}
      <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center lg:justify-start items-center flex-1 lg:min-w-0">
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

      {/* Separator */}
      <div className="hidden lg:block w-px h-5 bg-neutral-700 flex-shrink-0"></div>
      <div className="lg:hidden w-15 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

      {/* Clear Filters Button */}
      <div className="flex justify-center lg:justify-end flex-shrink-0">
        <button
          onClick={onClearFilters}
          className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400 text-xs font-medium hover:bg-blue-400 hover:text-neutral-900 hover:border-blue-400 transition-all duration-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
