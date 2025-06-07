const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateIndexOG() {
  try {
    console.log('Generating index OG image...');
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

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

    // Main title (left aligned)
    const titleGradient = ctx.createLinearGradient(0, 0, 1200, 0);
    titleGradient.addColorStop(0, '#10b981'); // emerald-500
    titleGradient.addColorStop(1, '#fbbf24'); // amber-500
    
    ctx.fillStyle = titleGradient;
    ctx.textAlign = 'left';
    ctx.font = 'bold 110px Arial, sans-serif';
    ctx.fillText('Audio Terms', 55, 310);

    // Summary text (left aligned)
    ctx.fillStyle = '#d1d5db'; // neutral-300
    ctx.font = '34px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Interactive reference guide for audiophile terminology.', 60, 370);
    ctx.fillText('Explore audio terms with sentiment analysis and frequency charts.', 60, 420);

    // Sample category tags (bottom section) - representing the main categories
    const sampleTags = ['Bass & Treble', 'Detail & Texture', 'Spatial & Imaging', 'Dynamics & Speed'];
    const tagsY = 480;
    const tagHeight = 36;
    const tagPadding = 16;
    const tagSpacing = 15;
    const borderRadius = 20;
    
    // Calculate total width needed for all tags
    ctx.font = 'bold 18px Arial, sans-serif';
    let totalTagsWidth = 0;
    const tagWidths = [];
    
    sampleTags.forEach(tag => {
      const width = ctx.measureText(tag).width + (tagPadding * 2);
      tagWidths.push(width);
      totalTagsWidth += width;
    });
    totalTagsWidth += (sampleTags.length - 1) * tagSpacing;
    
    // Start position to left-align all tags
    let currentX = 60;
    
    // Draw each tag with rounded corners
    sampleTags.forEach((tag, index) => {
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

    // Save the image
    const filepath = path.join(outputDir, 'og-image.png');
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    
    console.log('✓ Generated: og-image.png');
    console.log('🎉 Index OG image generated successfully!');
    console.log(`📁 Image saved to: ${filepath}`);
    
  } catch (error) {
    console.error('Error generating index OG image:', error);
    process.exit(1);
  }
}

// Run the generation
generateIndexOG();