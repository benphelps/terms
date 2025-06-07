import { termsData } from '@/data';
import { TermPageClient } from '@/components/TermPageClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Generate static paths for all terms to maintain static generation
export async function generateStaticParams() {
  return termsData.map((term) => ({
    slug: term.term.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Generate metadata for each term page
export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = termsData.find(
    (t) => t.term.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!term) {
    return {
      title: 'Term Not Found',
    };
  }

  const ogImageUrl = `/og/${slug}.png`;

  return {
    title: `${term.term} - Audiophile Terminology Guide`,
    description: term.summary,
    openGraph: {
      title: `${term.term} - Audiophile Terminology Guide`,
      description: term.summary,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${term.term} - Audiophile terminology definition`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${term.term} - Audiophile Terminology Guide`,
      description: term.summary,
      images: [ogImageUrl],
    },
  };
}

interface TermPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TermPage({ params }: TermPageProps) {
  const { slug } = await params;
  
  // Find the term based on the slug
  const term = termsData.find(
    (t) => t.term.toLowerCase().replace(/\s+/g, '-') === slug
  );

  // If term not found, show 404
  if (!term) {
    notFound();
  }

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

      <div className="container mx-auto max-w-6xl px-5 py-8 relative z-10">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="fixed top-8 left-8 sm:left-8 sm:right-auto right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-200 hover:bg-neutral-700/80 hover:text-white transition-all duration-300 z-50 shadow-lg"
        >
          <i className="fas fa-arrow-left"></i>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Term page content */}
        <TermPageClient term={term} termsData={termsData} />
      </div>
    </div>
  );
}