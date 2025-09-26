// API logic 
const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const { scrapeInstagramProfile } = require('../services/scraper');

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

    if (!scrapedData) {
      const oldInfluencerData = await Influencer.findOne({ username });
      if(oldInfluencerData) {
        console.warn(`Scraping failed. Serving stale data for ${username}.`);
        return res.json(oldInfluencerData);
      }
      return res.status(500).json({ msg: 'Scraping failed and no cached data available.' });
    }
    
    // CALCULATE
    const followersCount = parseInt(String(scrapedData.followers).replace(/,/g, ''), 10) || 0;
    const analytics = calculateAnalytics(scrapedData.recentPosts, followersCount);

    // PREPARE DATA
    const profileData = {
      username: username,
      fullName: scrapedData.fullName,
      profilePictureUrl: scrapedData.profilePictureUrl,
      followers: followersCount,
      following: parseInt(String(scrapedData.following).replace(/,/g, ''), 10) || 0,
      postsCount: parseInt(String(scrapedData.postsCount).replace(/,/g, ''), 10) || 0,
      recentPosts: scrapedData.recentPosts,
      engagementAnalytics: analytics,
      lastUpdated: new Date(),
    };

    // UPDATE DATABASE
    influencer = await Influencer.findOneAndUpdate(
      { username: username },
      profileData,
      { new: true, upsert: true }
    );
    
    console.log(`Successfully scraped and updated data for ${username}`);
    res.json(influencer);

  } catch (error) {
    console.error('Error in influencer route:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;