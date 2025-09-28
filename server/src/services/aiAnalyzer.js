let classifier = null; // holds the loaded model

/**
 * Loads the AI model into memory. Should be called once on server startup.
 */
const loadModel = async () => {
  if (classifier) {
    console.log('[AI Analyzer]: Model is already loaded.');
    return;
  }
  try {
    console.log('[AI Analyzer]: Loading model... (This may take several minutes on first run)');
    const { pipeline } = await import('@xenova/transformers');
    classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-large-patch14');
    console.log('[AI Analyzer]: Model loaded successfully and is ready for requests.');
  } catch (error) {
    console.error('[AI Analyzer]: Critical error - failed to load model.', error);
  }
};

/**
 * Analyzes an image URL using the pre-loaded model.
 */
const analyzeImage = async (imageUrl) => {
  if (!classifier) {
    console.error('[AI Analyzer]: Model not loaded. Ensure loadModel() is called on server startup.');
    return { tags: [], vibe: 'error', quality: 'error' };
  }

  try {
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
    const vibe = vibe_results[0]?.label || 'unknown';
    const quality = quality_results[0]?.label || 'standard';
    
    return { tags, vibe, quality };
  } catch (error) {
    console.error(`[AI Analyzer]: Analysis failed for ${imageUrl}: ${error.message}`);
    return { tags: [], vibe: 'unknown', quality: 'unknown' };
  }
};

module.exports = { loadModel, analyzeImage };