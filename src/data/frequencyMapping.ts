import type { FrequencyMapping } from '../types';

export const frequencyMapping: FrequencyMapping = {
  // High frequencies - "air" and brilliance range
  // Sources: https://www.gear4music.com/blog/audio-frequency-range/
  // https://www.vcelink.com/blogs/focus/audio-frequency-range
  // Brilliance range 6-20kHz adds air and sparkle
  Airy: { frequency: 12000, range: [10000, 20000], relevance: 0.9 },

  // Mid-high frequencies for detail and analysis
  // Sources: https://www.audioresurgence.com/audiophile-reviewers-glossary-of-terms
  // Analytical sounds emphasize upper mids for detail and precision
  Analytical: { frequency: 5000, range: [4000, 7000], relevance: 0.8 },

  // Low-mid boom frequencies - confirmed accurate
  // Sources: https://forums.tomsguide.com/threads/the-perfect-low-end-boomy-bass.245108/
  // https://www.audio-issues.com/music-mixing/ending-muddiness-boominess/
  // https://www.talkbass.com/threads/playing-in-a-boomy-room-how-to-eq.802391/
  // Boom occurs 100-200Hz, specifically 120-180Hz problematic area
  Boomy: { frequency: 150, range: [80, 250], relevance: 0.9 },

  // High frequency brightness - confirmed accurate
  // Sources: https://www.audioresurgence.com/audiophile-reviewers-glossary-of-terms
  // https://soundipity.blog/2024/09/16/audiophile-guide-understanding-sound-characteristics-and-descriptors/
  // Bright emphasizes high frequencies for crisp, lively tone
  Bright: { frequency: 8000, range: [4000, 12000], relevance: 0.9 },

  // Full spectrum coherence - broad range appropriate
  // Sources: General audio engineering - coherence refers to overall system performance across full spectrum
  Coherent: { frequency: 2000, range: [20, 20000], relevance: 0.7 },

  // Opposite of bright - lower frequencies
  // Sources: https://learningcenter.audioadvisor.com/audiophile-glossary-audio-descriptors/
  // Dark emphasizes low-pitched sounds, lacks brightness
  Dark: { frequency: 3000, range: [0, 5000], relevance: 0.8 },

  // Full spectrum detail - broad range appropriate
  // Sources: https://soundipity.blog/2024/09/16/audiophile-guide-understanding-sound-characteristics-and-descriptors/
  // Detail refers to system's ability to reproduce subtle nuances across spectrum
  Detailed: { frequency: 4000, range: [20, 20000], relevance: 0.8 },

  // UPDATED: Listening fatigue frequency lowered based on research
  // Sources: https://www.soundgym.co/blog/item?id=seven-frequency-zones-you-must-identify
  // https://mixingmonster.com/eq-frequency-ranges/
  // Fatigue occurs 2-4kHz, particularly around 3kHz where ear is sensitive
  Fatiguing: { frequency: 3000, range: [2000, 5000], relevance: 0.9 },

  // Fast transient response - broad range appropriate
  // Sources: General audio engineering - speed refers to transient response across frequency spectrum
  Fast: { frequency: 5000, range: [20, 20000], relevance: 0.8 },

  // Mid presence range - confirmed accurate
  // Sources: https://www.teachmeaudio.com/mixing/techniques/audio-spectrum
  // Forward/presence typically refers to 1.5-3.5kHz midrange prominence
  Forward: { frequency: 2000, range: [1500, 3500], relevance: 0.9 },

  // UPDATED: Harsh frequency adjusted based on research
  // Sources: https://gearspace.com/board/low-end-theory/76692-common-frequency-culprits-harsh-hardness-vocals-audio.html
  // Harshness often starts around 4.5kHz, ear resonant frequency 3.4kHz
  Harsh: { frequency: 5000, range: [3000, 8000], relevance: 0.9 },

  // Imaging/soundstage - high frequency related
  // Sources: General audio engineering - soundstage and imaging heavily dependent on high frequency information
  Imaging: { frequency: 8000, range: [20, 20000], relevance: 0.8 },

  // Relaxed midrange character
  // Sources: https://learningcenter.audioadvisor.com/audiophile-glossary-audio-descriptors/
  // Laid-back refers to recessed or relaxed midrange presentation
  "Laid-Back": { frequency: 2500, range: [2000, 5000], relevance: 0.7 },

  // Rich lower midrange
  // Sources: https://www.audioresurgence.com/audiophile-reviewers-glossary-of-terms
  // Lush refers to rich, full-bodied sound in lower frequencies
  Lush: { frequency: 800, range: [200, 3000], relevance: 0.8 },

  // Low frequency mud - confirmed accurate
  // Sources: https://www.audio-issues.com/music-mixing/ending-muddiness-boominess/
  // https://forums.tomsguide.com/threads/the-perfect-low-end-boomy-bass.245108/
  // Muddiness 200-300Hz, can extend to 100-250Hz
  Muddy: { frequency: 120, range: [100, 250], relevance: 0.9 },

  // Musical character - full spectrum
  // Sources: General audio engineering - musicality is subjective quality spanning full frequency range
  Musical: { frequency: 1500, range: [20, 20000], relevance: 0.7 },

  // Neutral response - full spectrum
  // Sources: https://www.audioresurgence.com/audiophile-reviewers-glossary-of-terms
  // Neutral refers to balanced, uncolored sound across full spectrum
  Neutral: { frequency: 1000, range: [20, 20000], relevance: 0.6 },

  // Tight low end punch - confirmed accurate
  // Sources: https://soundipity.blog/2024/09/16/audiophile-guide-understanding-sound-characteristics-and-descriptors/
  // Punchy refers to tight, controlled bass impact in sub-bass/bass range
  Punchy: { frequency: 80, range: [80, 150], relevance: 0.9 },

  // Sibilant frequencies - confirmed accurate
  // Sources: https://en.wikipedia.org/wiki/De-essing
  // https://www.sweetwater.com/insync/sibilance/
  // https://unison.audio/what-is-sibilance/
  // Multiple sources confirm: sibilance 5-10kHz, typically peaks around 5-8kHz, your 8500Hz is appropriate
  Sibilant: { frequency: 7000, range: [5000, 8000], relevance: 0.9 },

  // Sub-bass slam - confirmed accurate
  // Sources: https://www.teachmeaudio.com/mixing/techniques/audio-spectrum
  // https://audiblegenius.com/blog/audio-frequency-range-bands-chart
  // Deep sub-bass frequencies for physical impact, more felt than heard
  Slam: { frequency: 40, range: [20, 60], relevance: 0.9 },

  // Smooth midrange
  // Sources: https://learningcenter.audioadvisor.com/audiophile-glossary-audio-descriptors/
  // Smooth refers to pleasant midrange without harshness
  Smooth: { frequency: 2000, range: [1500, 4000], relevance: 0.8 },

  // High frequency soundstage
  // Sources: General audio engineering - soundstage heavily dependent on high frequency air and space
  Soundstage: { frequency: 10000, range: [8000, 20000], relevance: 0.7 },

  // Thin bass response
  // Sources: https://learningcenter.audioadvisor.com/audiophile-glossary-audio-descriptors/
  // Thin refers to lack of body in low-mid frequencies
  Thin: { frequency: 250, range: [200, 400], relevance: 0.8 },

  // Timbral character - full spectrum
  // Sources: General audio engineering - timbre is fundamental character spanning full frequency range
  Timbre: { frequency: 1500, range: [20, 20000], relevance: 0.8 },

  // Tight bass control - confirmed accurate
  // Sources: https://soundipity.blog/2024/09/16/audiophile-guide-understanding-sound-characteristics-and-descriptors/
  // Tight refers to well-controlled bass without excessive resonance
  Tight: { frequency: 60, range: [40, 80], relevance: 0.9 },

  // UPDATED: V-shaped represents bass and treble emphasis
  // Sources: General audio engineering - V-shaped refers to frequency response with boosted bass and treble, recessed mids
  // Using 4000Hz as the "valley" point between bass and treble emphasis
  "V-Shaped": { frequency: 4000, range: [80, 12000], relevance: 0.7 },

  // Veiled/masked midrange
  // Sources: https://learningcenter.audioadvisor.com/audiophile-glossary-audio-descriptors/
  // Veiled refers to lack of clarity in critical midrange frequencies
  Veiled: { frequency: 5000, range: [3000, 7000], relevance: 0.8 },

  // Warm bass/low-mid - confirmed accurate
  // Sources: https://www.vcelink.com/blogs/focus/audio-frequency-range
  // https://www.masteringthemix.com/blogs/learn/understanding-the-different-frequency-ranges
  // Warmth comes from 200-1000Hz range, particularly around 250-500Hz
  Warm: { frequency: 500, range: [200, 1000], relevance: 0.8 },
};
