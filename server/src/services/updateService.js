const Influencer = require('../models/Influencer');
const { scrapeInstagramProfile } = require('./scraper');
const { analyzeImage } = require('./aiAnalyzer');
const { analyzeAudienceDemographics } = require('./aiDemographics');

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

async function updateInfluencerProfile(username) {
  console.log(`[Update Service] Starting update for ${username}...`);
  const scrapedData = await scrapeInstagramProfile(username);
  if (!scrapedData) {
    throw new Error(`Scraping failed for ${username}.`);
  }

  const enrichedPosts = await Promise.all(
    (scrapedData.recentPosts || []).map(async (post) => {
      if (post.imageUrl) {
          const aiData = await analyzeImage(post.imageUrl);
          return { ...post, ...aiData };
      }
      return post;
    })
  );

  const enrichedReels = await Promise.all(
    (scrapedData.recentReels || []).map(async (reel) => {
      if (reel.imageUrl) {
          const aiData = await analyzeImage(reel.imageUrl);
          return { ...reel, ...aiData };
      }
      return reel;
    })
  );

  const followersCount = parseInt(String(scrapedData.followers).replace(/,/g, ''), 10) || 0;
  const analytics = calculateAnalytics(enrichedPosts, followersCount);
  const audienceDemographics = await analyzeAudienceDemographics({ ...scrapedData, recentPosts: enrichedPosts });

  const profileData = {
      username: scrapedData.username,
      fullName: scrapedData.fullName || 'N/A',
      profilePictureUrl: scrapedData.profilePictureUrl,
      followers: followersCount,
      following: parseInt(String(scrapedData.following).replace(/,/g, ''), 10) || 0,
      postsCount: parseInt(String(scrapedData.postsCount).replace(/,/g, ''), 10) || 0,
      recentPosts: enrichedPosts,
      recentReels: enrichedReels,
      engagementAnalytics: analytics,
      audienceDemographics: audienceDemographics,
      lastUpdated: new Date(),
  };

  const updatedInfluencer = await Influencer.findOneAndUpdate(
    { username: username },
    profileData,
    { new: true, upsert: true }
  );
  
  console.log(`[Update Service] Successfully updated ${username}`);
  return updatedInfluencer;
}

module.exports = { updateInfluencerProfile, calculateAnalytics };