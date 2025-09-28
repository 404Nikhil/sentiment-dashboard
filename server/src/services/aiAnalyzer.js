// image url to a base64 string.
async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType
    },
  };
}

/**
 * Analyzes an image URL using the Gemini API.
 * @param {string} imageUrl The URL of the image to analyze.
 * @returns {Promise<object>} An object containing tags, vibe, and quality.
 */
async function analyzeImage(imageUrl) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Gemini Analyzer]: API key not found in .env file.');
    return { tags: [], vibe: 'error', quality: 'API key missing' };
  }

  const mimeType = "image/jpeg";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    console.log(`[Gemini Analyzer]: Analyzing image ${imageUrl.slice(0, 50)}...`);
    const imagePart = await urlToGenerativePart(imageUrl, mimeType);

    const prompt = `Analyze this Instagram post image. Describe it as a JSON object with three keys: "tags" (an array of 2-3 relevant keywords like 'food', 'travel'), "vibe" (a single descriptive word for the ambiance like 'casual', 'energetic'), and "quality" (a single word for the visual quality like 'professional', 'blurry').`;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          imagePart
        ]
      }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const result = await response.json();
    const textResponse = result.candidates[0].content.parts[0].text;
    
    // Clean the response 
    const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const aiData = JSON.parse(jsonString);
    return aiData;

  } catch (error) {
    console.error(`[Gemini Analyzer]: Analysis failed for ${imageUrl}:`, error);
    return { tags: [], vibe: 'unknown', quality: 'unknown' };
  }
}

module.exports = { analyzeImage };