/**
 * Analyzes influencer data to infer audience demographics using the Gemini API.
 * @param {object} influencerData The influencer's profile data.
 * @returns {Promise<object>} An object containing inferred audience demographics.
 */
async function analyzeAudienceDemographics(influencerData) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Gemini Demographics]: API key not found in .env file.');
      return {
        genderSplit: [],
        ageGroups: [],
        topGeographies: [],
      };
    }
  
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  
    try {
      console.log(`[Gemini Demographics]: Analyzing audience for ${influencerData.username}...`);
  
      const postCaptions = influencerData.recentPosts.map(p => p.caption).join('\n');
      const postTags = influencerData.recentPosts.flatMap(p => p.tags || []).join(', ');
  
      const prompt = `
        Analyze the following influencer data and infer the audience demographics.
        Respond ONLY with a single JSON object. Do not include any text or markdown formatting before or after the JSON.
  
        Influencer Data:
        - Username: ${influencerData.username}
        - Full Name: ${influencerData.fullName}
        - Followers: ${influencerData.followers}
        - Posts Count: ${influencerData.postsCount}
        - Recent Post Captions Summary: ${postCaptions.substring(0, 500)}...
        - Common Post Tags: ${postTags}
  
        The JSON object must have the following structure:
        {
          "genderSplit": [
            { "name": "Male", "value": 55 },
            { "name": "Female", "value": 45 }
          ],
          "ageGroups": [
            { "name": "18-24", "value": 30 },
            { "name": "25-34", "value": 40 },
            { "name": "35-44", "value": 20 },
            { "name": "45+", "value": 10 }
          ],
          "topGeographies": [
            { "name": "USA", "value": 25 },
            { "name": "Brazil", "value": 15 },
            { "name": "India", "value": 10 }
          ]
        }
  
        - "genderSplit": An array of objects representing the percentage split. The sum of values should be 100.
        - "ageGroups": An array of objects representing the percentage split across age groups. The sum of values should be 100.
        - "topGeographies": An array of the top 3 countries with their percentage. The sum does not have to be 100.
      `;
  
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
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
  
      const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const demographicsData = JSON.parse(jsonString);
      return demographicsData;
  
    } catch (error) {
      console.error(`[Gemini Demographics]: Analysis failed for ${influencerData.username}:`, error);
      return {
          genderSplit: [],
          ageGroups: [],
          topGeographies: [],
        };
    }
  }
  
  module.exports = { analyzeAudienceDemographics };