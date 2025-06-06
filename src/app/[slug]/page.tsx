import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { termsData } from '@/data';
import { TermPageClient } from './TermPageClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static paths for all terms
export async function generateStaticParams() {
  return termsData.map((term) => ({
    slug: term.term.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Generate metadata for each term page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = termsData.find(
    t => t.term.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!term) {
    return {
      title: 'Term Not Found - Audiophile Terminology Guide',
    };
  }

  return {
    title: `${term.term} - Audiophile Terminology Guide`,
    description: term.summary,
    openGraph: {
      type: 'website',
      url: `https://www.audiowords.net/${slug}`,
      title: `${term.term} - Audiophile Terminology Guide`,
      description: term.summary,
      images: [
        {
          url: 'https://www.audiowords.net/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Audiophile Terminology Guide'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${term.term} - Audiophile Terminology Guide`,
      description: term.summary,
      images: ['https://www.audiowords.net/og-image.png']
    }
  };
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const term = termsData.find(
    t => t.term.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!term) {
    notFound();
  }

  return <TermPageClient termData={term} />;
}