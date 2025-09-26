// Database schema

const mongoose = require('mongoose');

const InfluencerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  profilePictureUrl: String,
  followers: Number,
  following: Number,
  postsCount: Number,
  location: String,
  age: Number,
  status: String,
  basicStats: [mongoose.Schema.Types.Mixed],
  personality: [mongoose.Schema.Types.Mixed],
  interests: [mongoose.Schema.Types.Mixed],
  occupation: mongoose.Schema.Types.Mixed,
  engagementAnalytics: mongoose.Schema.Types.Mixed,
  recentPosts: [mongoose.Schema.Types.Mixed],
  audienceDemographics: mongoose.Schema.Types.Mixed,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Influencer', InfluencerSchema);