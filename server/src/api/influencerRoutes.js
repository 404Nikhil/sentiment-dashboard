const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const { updateInfluencerProfile } = require('../services/updateService');

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { force } = req.query;

  try {
    if (force !== 'true') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const influencer = await Influencer.findOne({
        username: username,
        lastUpdated: { $gte: twentyFourHoursAgo },
      });

      if (influencer) {
        const hasAiData = (influencer.recentPosts && influencer.recentPosts.length > 0 && influencer.recentPosts[0].tags) ||
                          (influencer.recentReels && influencer.recentReels.length > 0 && influencer.recentReels[0].tags);

        if (hasAiData) {
          console.log(`Serving fresh and complete data from cache for ${username}`);
          return res.json(influencer);
        }
      }
    }
    
    console.log(`Force refreshing or fetching new data for ${username}.`);
    const updatedProfile = await updateInfluencerProfile(username);
    res.json(updatedProfile);

  } catch (error) {
    console.error(`Error in influencer route for ${username}:`, error.message);
    const oldInfluencerData = await Influencer.findOne({ username });
    if(oldInfluencerData) {
      console.warn(`Scraping failed. Serving stale data for ${username}.`);
      return res.json(oldInfluencerData);
    }
    res.status(500).json({ msg: `Scraping failed and no cached data available for ${username}.` });
  }
});

module.exports = router;