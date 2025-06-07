import { termsData } from '@/data';
import HomePage from '../page';

// Generate static paths for all terms to maintain static generation
export async function generateStaticParams() {
  return termsData.map((term) => ({
    slug: term.term.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function TermPage() {
  // Just render the homepage - it will detect the URL and show the modal
  return <HomePage />;
}