import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { AudioTerm } from '../types';

export function useSearch(terms: AudioTerm[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AudioTerm[]>([]);

  // Create Fuse.js instance
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'term', weight: 0.3 },
        { name: 'summary', weight: 0.25 },
        { name: 'shortExplanation', weight: 0.2 },
        { name: 'detailedDescription', weight: 0.15 },
        { name: 'subCategories', weight: 0.1 }
      ],
      threshold: 0.4, // More lenient fuzzy matching (0 = exact, 1 = very fuzzy)
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true, // Search entire string, not just beginning
    };
    
    return new Fuse(terms, options);
  }, [terms]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(searchQuery);
    const searchResults = results.map(result => result.item);
    setSearchResults(searchResults);
  }, [searchQuery, fuse]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    hasSearchQuery: searchQuery.trim().length > 0,
  };
}