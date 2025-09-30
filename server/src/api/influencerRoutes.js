const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const { updateInfluencerProfile } = require('../services/updateService');

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { force } = req.query;

  try {
    // Cache check
    if (force !== 'true') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const influencer = await Influencer.findOne({
        username: username,
        lastUpdated: { $gte: twentyFourHoursAgo },
      });
      if (influencer) {
        console.log(`Serving fresh data from cache for ${username}`);
        return res.json(influencer);
      }
    }
    
    console.log(`Force refreshing data for ${username}. Bypassing cache.`);
    const updatedProfile = await updateInfluencerProfile(username);
    res.json(updatedProfile);

  } catch (error) {
    console.error(`Error in influencer route for ${username}:`, error.message);
    // Fallback to stale data if scraping fails
    const oldInfluencerData = await Influencer.findOne({ username });
    if(oldInfluencerData) {
      console.warn(`Scraping failed. Serving stale data for ${username}.`);
      return res.json(oldInfluencerData);
    }
    res.status(500).json({ msg: `Scraping failed and no cached data available for ${username}.` });
  }
});

module.exports = router;