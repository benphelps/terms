const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Dynamically import the termsData (ES modules)
async function generateOGImages() {
  try {
    // Import the terms data with explicit file URL for better compatibility
    const termsModule = await import(`file://${path.resolve(__dirname, '../src/data/termsData.ts')}`);
    const { termsData } = termsModule;
    
    console.log(`Starting traditional OG image generation for ${termsData.length} terms...`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../public/og');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Function to create slug from term name
    function createSlug(term) {
      return term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Function to wrap text to multiple lines
    function wrapText(ctx, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    }

    // Get sentiment colors
    function getSentimentColor(category) {
      switch (category) {
        case 'positive': return '#10b981';
        case 'negative': return '#fbbf24';
        default: return '#6b7280';
      }
    }

    // Generate image for each term
    for (const term of termsData) {
      console.log(`Generating traditional OG image for: ${term.term}`);
      
      // Create canvas
      const canvas = createCanvas(1200, 630);
      const ctx = canvas.getContext('2d');

      // Create main background - neutral-950
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1200, 630);

      // Add the same background gradients as the site
      // Gradient 1: emerald at 20% 50% - MORE VIBRANT
      const gradient1 = ctx.createRadialGradient(240, 315, 0, 240, 315, 400);
      gradient1.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      gradient1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, 1200, 630);

      // Gradient 2: amber at 80% 50% - MORE VIBRANT
      const gradient2 = ctx.createRadialGradient(960, 315, 0, 960, 315, 400);
      gradient2.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
      gradient2.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, 1200, 630);

      // Gradient 3: purple at 50% 80% - MORE VIBRANT
      const gradient3 = ctx.createRadialGradient(600, 504, 0, 600, 504, 350);
      gradient3.addColorStop(0, 'rgba(139, 92, 246, 0.10)');
      gradient3.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, 1200, 630);

      // Gradient 4: pink at 30% 20% - MORE VIBRANT
      const gradient4 = ctx.createRadialGradient(360, 126, 0, 360, 126, 350);
      gradient4.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
      gradient4.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = gradient4;
      ctx.fillRect(0, 0, 1200, 630);

      // Top section with site branding
      ctx.fillStyle = '#e5e7eb'; // neutral-200
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Audiophile Terminology Guide', 60, 100);

      // Site URL
      ctx.fillStyle = '#9ca3af'; // neutral-400
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText('audiowords.net', 60, 140);

      // Sentiment indicator dot
      const sentimentColor = getSentimentColor(term.primaryCategory);
      ctx.fillStyle = sentimentColor;
      ctx.beginPath();
      ctx.arc(1120, 100, 18, 0, Math.PI * 2);
      ctx.fill();

      // Main term title (left aligned)
      const titleGradient = ctx.createLinearGradient(0, 0, 1200, 0);
      titleGradient.addColorStop(0, '#10b981'); // emerald-500
      titleGradient.addColorStop(1, '#fbbf24'); // amber-500
      
      ctx.fillStyle = titleGradient;
      ctx.textAlign = 'left';
      
      // Handle long terms by adjusting font size
      let fontSize = 110;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      while (ctx.measureText(term.term).width > 1080 && fontSize > 60) {
        fontSize -= 6;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }
      
      ctx.fillText(term.term, 55, 310);

      // Summary text (left aligned)
      ctx.fillStyle = '#d1d5db'; // neutral-300
      ctx.font = '34px Arial, sans-serif';
      ctx.textAlign = 'left';
      
      const maxSummaryWidth = 1080;
      const summaryLines = wrapText(ctx, term.summary, maxSummaryWidth);
      const lineHeight = 50;
      const summaryStartY = 370;
      
      // Limit to 2 lines and truncate if needed
      const displayLines = summaryLines.slice(0, 2);
      if (summaryLines.length > 2) {
        displayLines[1] = displayLines[1].substring(0, displayLines[1].length - 3) + '...';
      }
      
      displayLines.forEach((line, index) => {
        ctx.fillText(line, 60, summaryStartY + (index * lineHeight));
      });

      // Subcategory tags (bottom section) - match site styling exactly
      if (term.subCategories && term.subCategories.length > 0) {
        const tagsY = 480;
        const tagHeight = 36; // smaller size
        const tagPadding = 16; // reduced padding
        const tagSpacing = 15;
        const borderRadius = 20; // rounded-2xl
        
        // Calculate total width needed for all tags
        ctx.font = 'bold 18px Arial, sans-serif'; // smaller tag text
        let totalTagsWidth = 0;
        const tagWidths = [];
        
        term.subCategories.forEach(tag => {
          const width = ctx.measureText(tag).width + (tagPadding * 2);
          tagWidths.push(width);
          totalTagsWidth += width;
        });
        totalTagsWidth += (term.subCategories.length - 1) * tagSpacing;
        
        // Start position to left-align all tags
        let currentX = 60;
        
        // Draw each tag with rounded corners
        term.subCategories.forEach((tag, index) => {
          const tagWidth = tagWidths[index];
          
          // Tag background - bg-neutral-900
          ctx.fillStyle = '#171717';
          ctx.beginPath();
          ctx.roundRect(currentX, tagsY, tagWidth, tagHeight, borderRadius);
          ctx.fill();
          
          // Tag border - border-neutral-800 border-2
          ctx.strokeStyle = '#262626';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(currentX, tagsY, tagWidth, tagHeight, borderRadius);
          ctx.stroke();
          
          // Tag text - text-neutral-400
          ctx.fillStyle = '#9ca3af';
          ctx.textAlign = 'center';
          ctx.fillText(tag, currentX + tagWidth / 2, tagsY + 25);
          
          currentX += tagWidth + tagSpacing;
        });
      }

      // Save the image
      const slug = createSlug(term.term);
      const filename = `${slug}.png`;
      const filepath = path.join(outputDir, filename);
      
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filepath, buffer);
      
      console.log(`✓ Generated: ${filename}`);
    }

    console.log('\n🎉 All traditional OG images generated successfully!');
    console.log(`📁 Images saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error generating OG images:', error);
    process.exit(1);
  }
}

// Run the generation
generateOGImages();