# Audiophile Terminology Guide

An interactive reference website for audio enthusiasts that catalogs audiophile terms with detailed explanations, sentiment analysis, frequency associations, and test tracks.

## Features

- **Comprehensive Term Database**: Detailed definitions with rich HTML formatting
- **Interactive Search**: Fuzzy search across multiple term fields using Fuse.js
- **Smart Filtering**: Filter by sentiment categories and subcategories
- **Frequency Visualization**: D3.js-powered interactive chart plotting terms by frequency association
- **Music Integration**: Built-in audio player with Deezer API integration for demonstration tracks
- **Responsive Design**: Optimized for both desktop and mobile devices
- **SEO Optimized**: Static generation with proper meta tags for each term

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Search**: Fuse.js for fuzzy searching
- **Visualization**: D3.js for frequency charts
- **Icons**: Lucide React + FontAwesome
- **Audio**: Deezer API with CORS proxy

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd terms-dist

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [slug]/            # Dynamic term pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── FilterButton.tsx   # Filter UI components
│   ├── Filters.tsx        
│   ├── FrequencyChart.tsx # D3.js frequency visualization
│   ├── Modal.tsx          # Modal dialogs
│   ├── SearchBox.tsx      # Search interface
│   ├── TermCard.tsx       # Term display cards
│   └── TrackRow.tsx       # Music track components
├── data/                  # Static data and configurations
│   ├── frequencyMapping.ts # Term-to-frequency associations
│   ├── harmanCurve.ts     # Reference frequency curve
│   ├── termsData.ts       # Main term definitions
│   └── tracksData.ts      # Music track data
├── hooks/                 # Custom React hooks
│   ├── useFilters.ts      # Filter state management
│   ├── useMusicPlayer.ts  # Audio player state
│   └── useSearch.ts       # Search functionality
└── types.ts              # TypeScript type definitions
```

## Key Features

### Search & Filtering

- **Fuzzy Search**: Intelligent search across term names, descriptions, and related terms
- **URL Parameters**: Search terms accessible via `/?search=term` for shareable links
- **Multi-dimensional Filtering**: Filter by sentiment (positive/negative/neutral) and subcategories

### Data Visualization

- **Interactive Frequency Chart**: Click points to navigate to terms or search results
- **Harman Curve Reference**: Industry-standard frequency response overlay
- **Dynamic Positioning**: Terms plotted based on their frequency associations

### Music Integration

- **Global Audio State**: Prevents multiple simultaneous playback across components
- **Progress Tracking**: Visual playback indicators throughout the UI
- **Deezer Integration**: Preview tracks that demonstrate audio concepts

### Responsive Behavior

- **Desktop**: Hover to expand cards, single click to navigate
- **Mobile**: Touch to expand, touch again to navigate
- **Smart Detection**: Reliable touch device detection

## Data Architecture

### AudioTerm Interface

```typescript
interface AudioTerm {
  name: string;
  slug: string;
  definition: string;        // Rich HTML content
  sentiment: 'positive' | 'negative' | 'neutral';
  subcategory: string;
  relatedTerms?: string[];
  oppositeTerms?: string[];
  frequency?: number;        // For chart positioning
}
```

### Content Management

- **Rich HTML**: Term definitions support HTML formatting via `dangerouslySetInnerHTML`
- **Sentiment Analysis**: Categorized for filtering and UI styling
- **Cross-references**: Related and opposite term linking
- **Frequency Mapping**: Associates terms with frequency ranges for visualization

## Deployment

The project is configured for static export and can be deployed to any static hosting service:

```bash
npm run build
```

Generated files will be in the `out/` directory for static hosting.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code style
5. Submit a pull request

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes
- **ShareAlike** — If you remix or transform the material, you must distribute under the same license
