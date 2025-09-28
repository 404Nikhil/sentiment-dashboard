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


    const prompt = `
      Analyze the provided Instagram image and respond ONLY with a single JSON object. Do not include any text or markdown formatting before or after the JSON.
      The JSON object must have the following structure:
      {
        "tags": ["tag1", "tag2"],
        "vibe": "...",
        "quality": {
          "lighting": "...",
          "visualAppeal": "...",
          "consistency": "..."
        }
      }
      - "tags": An array of 2-3 relevant string keywords from this list: ['food', 'travel', 'fashion', 'selfie', 'car', 'pet', 'fitness', 'nature', 'city', 'art', 'tech', 'lifestyle', 'product'].
      - "vibe": A single descriptive string from this list: ['casual', 'aesthetic', 'luxury/lavish', 'energetic', 'calm', 'professional', 'happy', 'moody', 'minimalist'].
      - "quality": An object with three keys. For each key, provide a single, concise descriptive string (e.g., "Bright", "Poor", "High", "Inconsistent").
          - "lighting": Describes the quality of light (e.g., "Good", "Harsh", "Dim", "Natural").
          - "visualAppeal": Describes the overall aesthetic attractiveness (e.g., "High", "Average", "Low", "Striking").
          - "consistency": Describes how well it fits a consistent theme if one is apparent (e.g., "Consistent", "Off-brand", "Varied").
    `;
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