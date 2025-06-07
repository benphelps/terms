# OG Image Generation Script

This script automatically generates static Open Graph (OG) images for each audiophile term in the terminology guide.

## What it does

The script reads the terms data from `src/data/termsData.ts` and generates 1200x630 PNG images for each term. These images are based on the design from the existing `public/og-image.svg` template and include:

- The term name as the main title
- The term's summary as the subtitle (automatically wrapped and truncated if needed)
- The same visual elements as the original design (frequency bars, gradients, curves)
- A sentiment indicator color (green for positive, red for negative, gray for neutral)

## Generated files

Images are saved to `public/og/` with filenames like `{slug}.png` where slug is the term name lowercased with spaces replaced by hyphens.

Examples:
- "Airy" → `airy.png`
- "Laid-Back" → `laid-back.png`
- "V-Shaped" → `v-shaped.png`

## Usage

### Manual generation
```bash
npm run generate:og
```

### Automatic generation (part of build)
```bash
npm run build
```

The OG images are automatically generated before the Next.js build process, ensuring they're available for static deployment.

## Dependencies

- `canvas` - Node.js canvas implementation for server-side image generation
- Node.js built-in modules: `fs`, `path`

## Technical details

- **Image dimensions**: 1200x630 (standard OG image size)
- **Format**: PNG
- **Canvas library**: Uses node-canvas for server-side rendering
- **TypeScript support**: Dynamically imports TypeScript files using file:// URLs
- **Text handling**: Automatic text wrapping and truncation for long summaries
- **Design consistency**: Maintains the same color scheme and visual elements as the original template

## Troubleshooting

If you encounter issues with the canvas library:

1. Make sure you have the required system dependencies:
   - **macOS**: No additional setup needed
   - **Linux**: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
   - **Windows**: Use WSL or install Windows build tools

2. If TypeScript warnings appear, they're harmless and don't affect functionality.

3. Make sure all terms data is properly formatted in `src/data/termsData.ts`.