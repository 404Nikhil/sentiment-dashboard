const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const { scrapeInstagramProfile } = require('../services/scraper');
const { analyzeImage } = require('../services/aiAnalyzer');

const calculateAnalytics = (posts, followers) => {
  if (!posts || posts.length === 0) return { avgLikes: 0, avgComments: 0, engagementRate: 0, engagementLevel: 'N/A' };
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;
  let engagementRate = 0;
  if (followers > 0) engagementRate = ((avgLikes + avgComments) / followers) * 100;

  let engagementLevel = 'Low';
  if (engagementRate > 5) {
    engagementLevel = 'High';
  } else if (engagementRate > 2) {
    engagementLevel = 'Medium';
  }

  return {
    avgLikes: Math.round(avgLikes),
    avgComments: Math.round(avgComments),
    engagementRate: parseFloat(engagementRate.toFixed(2)),
    engagementLevel: engagementLevel
  };
};

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let influencer = await Influencer.findOne({
      username: username,
      lastUpdated: { $gte: twentyFourHoursAgo },
    });
    if (influencer) {
      console.log(`Serving fresh data from cache for ${username}`);
      return res.json(influencer);
    }

    const scrapedData = await scrapeInstagramProfile(username);
    if (!scrapedData || !scrapedData.recentPosts || !scrapedData.recentPosts.length) {
      const oldInfluencerData = await Influencer.findOne({ username });
      if(oldInfluencerData) {
        console.warn(`Scraping failed. Serving stale data for ${username}.`);
        return res.json(oldInfluencerData);
      }
      return res.status(500).json({ msg: 'Scraping failed and no cached data available.' });
    }

    console.log('Starting AI analysis for scraped posts...');
    const enrichedPosts = await Promise.all(
      scrapedData.recentPosts.map(async (post) => {
        if (post.imageUrl) {
            const aiData = await analyzeImage(post.imageUrl);
            return { ...post, ...aiData };
        }
        return post;
      })
    );

    const followersCount = parseInt(String(scrapedData.followers).replace(/,/g, ''), 10) || 0;
    const analytics = calculateAnalytics(enrichedPosts, followersCount);

    const profileData = {
        username: username,
        fullName: scrapedData.fullName || 'N/A',
        profilePictureUrl: scrapedData.profilePictureUrl,
        followers: followersCount,
        following: parseInt(String(scrapedData.following).replace(/,/g, ''), 10) || 0,
        postsCount: parseInt(String(scrapedData.postsCount).replace(/,/g, ''), 10) || 0,
        recentPosts: enrichedPosts,
        engagementAnalytics: analytics,
        lastUpdated: new Date(),
        location: "SPAIN",
        age: 23,
        status: "SINGLE",
        basicStats: [ { "label": "Sentiment Score", "value": "85%", "icon": "sentiment" }, { "label": "Extrovert Level", "value": "Mid", "icon": "extrovert" }, { "label": "Social Topics", "value": "8.2/10", "icon": "cognizant" }, { "label": "Religious or Hate Speech", "value": "Low Risk", "icon": "risk" }, { "label": "Fair Play Rating", "value": "8.0/10", "icon": "fair-play" } ],
        personality: [ { "trait": "Adventure", "score": 78 }, { "trait": "Extrovert", "score": 46 }, { "trait": "Sportive", "score": 94 }, { "trait": "Attentive", "score": 55 } ],
        interests: [ { "name": "Swimming", "value": 80 }, { "name": "Travel", "value": 64 }, { "name": "Adventure", "value": 64 }, { "name": "Movies", "value": 23 }, { "name": "Gaming", "value": 80 }, { "name": "Social", "value": 16 } ],
        occupation: { "jobTitle": "Software developer", "company": "Microsoft", "annualIncome": "$100K" }
    };
    
    influencer = await Influencer.findOneAndUpdate(
      { username: username },
      profileData,
      { new: true, upsert: true }
    );
    
    console.log(`Successfully scraped, analyzed, and sent data for ${username}`);
    res.json(influencer);

  } catch (error) {
    console.error('Error in influencer route:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;