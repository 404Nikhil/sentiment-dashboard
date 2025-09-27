const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const { scrapeInstagramProfile } = require('../services/scraper');
// 1. Import the AI Analyzer at the top of the file
const { analyzeImage } = require('../services/aiAnalyzer');

/**
 * Calculates engagement analytics based on post data and follower count.
 * @param {Array} posts - Array of post objects with likes and comments.
 * @param {number} followers - The total follower count.
 * @returns {object} An object with avgLikes, avgComments, and engagementRate.
 */
const calculateAnalytics = (posts, followers) => {
  if (!posts || posts.length === 0) {
    return { avgLikes: 0, avgComments: 0, engagementRate: 0 };
  }

  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;

  let engagementRate = 0;
  if (followers > 0) {
    engagementRate = ((avgLikes + avgComments) / followers) * 100;
  }

  return {
    avgLikes: Math.round(avgLikes),
    avgComments: Math.round(avgComments),
    engagementRate: parseFloat(engagementRate.toFixed(2)),
  };
};

// @route   GET /api/influencer/:username
// @desc    Get influencer profile data from DB or scrape if needed
// @access  Public
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // CHECK CACHE
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let influencer = await Influencer.findOne({
      username: username,
      lastUpdated: { $gte: twentyFourHoursAgo },
    });

    if (influencer) {
      console.log(`Serving fresh data from cache for ${username}`);
      return res.json(influencer);
    }

    // SCRAPE
    console.log(`No fresh data for ${username}. Starting scraper...`);
    const scrapedData = await scrapeInstagramProfile(username);

    // If scraping fails, try to serve stale data as a fallback.
    if (!scrapedData || !scrapedData.recentPosts || scrapedData.recentPosts.length === 0) {
      const oldInfluencerData = await Influencer.findOne({ username });
      if (oldInfluencerData) {
        console.warn(`Scraping failed or no posts found. Serving stale data for ${username}.`);
        return res.json(oldInfluencerData);
      }
      return res.status(500).json({ msg: 'Scraping failed and no cached data available.' });
    }

    // SAI ANALYSIS
    console.log('Starting AI analysis for scraped posts...');
    const enrichedPosts = await Promise.all(
      scrapedData.recentPosts.map(async (post) => {
        const aiData = await analyzeImage(post.imageUrl);
        return { ...post, ...aiData };
      })
    );

    // CALCULATE
    // Perform analytics on the newly scraped and enriched data.
    const followersCount = parseInt(String(scrapedData.followers).replace(/,/g, ''), 10) || 0;
    const analytics = calculateAnalytics(enrichedPosts, followersCount);

    // PREPARE DATA
    // Assemble the final, complete profile object.
    const profileData = {
      username: username,
      fullName: scrapedData.fullName || 'N/A',
      profilePictureUrl: scrapedData.profilePictureUrl,
      followers: followersCount,
      following: parseInt(String(scrapedData.following).replace(/,/g, ''), 10) || 0,
      postsCount: parseInt(String(scrapedData.postsCount).replace(/,/g, ''), 10) || 0,
      recentPosts: enrichedPosts, // <-- Use the AI-enriched posts here
      engagementAnalytics: analytics,
      lastUpdated: new Date(),
      location: "SPAIN",
      age: 23,
      status: "SINGLE",
      basicStats: [
        { "label": "Sentiment Score", "value": "85%", "icon": "sentiment" },
        { "label": "Extrovert Level", "value": "Mid", "icon": "extrovert" },
        { "label": "Social Topics", "value": "8.2/10", "icon": "cognizant" },
        { "label": "Religious or Hate Speech", "value": "Low Risk", "icon": "risk" },
        { "label": "Fair Play Rating", "value": "8.0/10", "icon": "fair-play" }
      ],
      personality: [ { "trait": "Adventure", "score": 78 }, { "trait": "Extrovert", "score": 46 }, { "trait": "Sportive", "score": 94 }, { "trait": "Attentive", "score": 55 } ],
      interests: [ { "name": "Swimming", "value": 80 }, { "name": "Travel", "value": 64 }, { "name": "Adventure", "value": 64 }, { "name": "Movies", "value": 23 }, { "name": "Gaming", "value": 80 }, { "name": "Social", "value": 16 } ],
      occupation: { "jobTitle": "Software developer", "company": "Microsoft", "annualIncome": "$100K" }
    };
    
    // UPDATE DATABASE
    influencer = await Influencer.findOneAndUpdate(
      { username: username },
      profileData,
      { new: true, upsert: true }
    );
    
    console.log(`Successfully scraped, analyzed, and updated data for ${username}`);
    res.json(influencer);

  } catch (error) {
    console.error('Error in influencer route:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;