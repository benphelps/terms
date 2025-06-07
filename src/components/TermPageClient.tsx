"use client";

import { TermPageContent } from './TermPageContent';
import type { AudioTerm } from '../types';

interface TermPageClientProps {
  term: AudioTerm;
  termsData: AudioTerm[];
}

export function TermPageClient({ term, termsData }: TermPageClientProps) {
  return (
    <TermPageContent
      term={term}
      searchQuery=""
      onSearchTerm={(searchTerm) => {
        // For static pages, navigate to the homepage with search
        window.location.href = `/?search=${encodeURIComponent(searchTerm)}`;
      }}
      onOpenTerm={(newTerm) => {
        // Navigate to the other term's static page
        const slug = newTerm.term.toLowerCase().replace(/\s+/g, "-");
        window.location.href = `/${slug}`;
      }}
      termsData={termsData}
    />
  );
}