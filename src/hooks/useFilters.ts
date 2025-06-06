import { useState, useMemo } from 'react';
import type { AudioTerm, FilterType } from '../types';

export function useFilters(terms: AudioTerm[]) {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>('all');
  const [subcategoryFilters, setSubcategoryFilters] = useState<string[]>([]);

  // Extract all unique subcategories
  const allSubcategories = useMemo(() => {
    const subcategorySet = new Set<string>();
    terms.forEach(term => {
      term.subCategories.forEach(subCat => {
        subcategorySet.add(subCat);
      });
    });
    return Array.from(subcategorySet).sort();
  }, [terms]);

  // Filter terms based on current filters
  const filteredTerms = useMemo(() => {
    let filtered = [...terms];

    // Apply primary category filter
    if (primaryFilter !== 'all') {
      filtered = filtered.filter(term => term.primaryCategory === primaryFilter);
    }

    // Apply subcategory filters
    if (subcategoryFilters.length > 0) {
      filtered = filtered.filter(term => 
        subcategoryFilters.some(filter => term.subCategories.includes(filter))
      );
    }

    return filtered;
  }, [terms, primaryFilter, subcategoryFilters]);

  const clearFilters = () => {
    setPrimaryFilter('all');
    setSubcategoryFilters([]);
  };

  const toggleSubcategoryFilter = (subcategory: string) => {
    setSubcategoryFilters(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(filter => filter !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  return {
    primaryFilter,
    setPrimaryFilter,
    subcategoryFilters,
    toggleSubcategoryFilter,
    allSubcategories,
    filteredTerms,
    clearFilters,
  };
}