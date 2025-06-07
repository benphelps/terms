import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { AudioTerm } from '../types';
import { audioTermProducts } from '../data/productData';
import { audioTermTracks } from '../data/tracksData';

interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export function useSearch(terms: AudioTerm[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AudioTerm[]>([]);
  const [searchMatches, setSearchMatches] = useState<Record<string, SearchMatch[]>>({});

  // Create enhanced search data that includes product names and track info
  const enhancedTerms = useMemo(() => {
    return terms.map(term => {
      const termProducts = audioTermProducts[term.term as keyof typeof audioTermProducts];
      const productNames = termProducts 
        ? [...(termProducts.iem || []), ...(termProducts.headphone || [])]
            .map(product => product.name).join(' ')
        : '';
      
      const termTracks = audioTermTracks[term.term as keyof typeof audioTermTracks];
      const trackInfo = termTracks
        ? termTracks.join(' ')
        : '';
      
      return {
        ...term,
        productNames, // Add product names as a searchable field
        trackInfo, // Add track info as a searchable field
      };
    });
  }, [terms]);

  // Create Fuse.js instance
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'term', weight: 0.3 },
        { name: 'summary', weight: 0.25 },
        { name: 'shortExplanation', weight: 0.2 },
        { name: 'detailedDescription', weight: 0.15 },
        { name: 'productNames', weight: 0.15 }, // Add product names to search
        { name: 'trackInfo', weight: 0.1 }, // Add track info to search
        { name: 'subCategories', weight: 0.05 }
      ],
      threshold: 0.4, // More lenient fuzzy matching (0 = exact, 1 = very fuzzy)
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true, // Search entire string, not just beginning
    };
    
    return new Fuse(enhancedTerms, options);
  }, [enhancedTerms]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchMatches({});
      return;
    }

    const results = fuse.search(searchQuery);
    const searchResults = results.map(result => result.item);
    
    // Create matches map for highlighting
    const matches: Record<string, SearchMatch[]> = {};
    results.forEach(result => {
      if (result.matches) {
        matches[result.item.term] = result.matches as SearchMatch[];
      }
    });
    
    setSearchResults(searchResults);
    setSearchMatches(matches);
  }, [searchQuery, fuse]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchMatches,
    hasSearchQuery: searchQuery.trim().length > 0,
  };
}