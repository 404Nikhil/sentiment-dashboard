// model is only loaded into memory once.
class AiAnalyzer {
    static instance = null;
    static async getInstance() {
      if (!this.instance) {
        console.log('[AI Analyzer]: Loading model... (This may take a moment on first run)');
        const { pipeline } = await import('@xenova/transformers');
        this.instance = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-large-patch14');
        console.log('[AI Analyzer]: Model loaded successfully.');
      }
      return this.instance;
    }
  }
  
  /**
   * Analyzes an image URL to generate tags, vibe, and quality indicators.
   * @param {string} imageUrl The URL of the image to analyze.
   * @returns {Promise<object>} An object containing tags, vibe, and quality.
   */
  const analyzeImage = async (imageUrl) => {
    try {
      const classifier = await AiAnalyzer.getInstance();
      if (!classifier) {
        throw new Error("AI classifier not initialized.");
      }
  
      console.log(`[AI Analyzer]: Analyzing image ${imageUrl.slice(0, 50)}...`);
  
      const keyword_labels = ["food", "travel", "fashion", "selfie", "car", "pet", "fitness", "nature", "city", "art", "tech"];
      const vibe_labels = ["casual", "aesthetic", "luxury", "energetic", "calm", "professional", "happy", "moody"];
      const quality_labels = ["high resolution", "good lighting", "professional photography", "blurry", "low quality", "screenshot"];
  
      const [keyword_results, vibe_results, quality_results] = await Promise.all([
        classifier(imageUrl, keyword_labels),
        classifier(imageUrl, vibe_labels),
        classifier(imageUrl, quality_labels),
      ]);
  
      const tags = keyword_results.filter(r => r.score > 0.9).slice(0, 2).map(r => r.label);
      const vibe = vibe_results[0]?.label || 'unknown'; // Get the single best vibe
      const quality = quality_results[0]?.label || 'standard'; // Get the single best quality indicator
      
      return { tags, vibe, quality };
  
    } catch (error) {
      console.error(`[AI Analyzer]: Analysis failed for ${imageUrl}: ${error.message}`);
      return {
        tags: [],
        vibe: 'unknown',
        quality: 'unknown',
      };
    }
  };
  
  module.exports = { analyzeImage };