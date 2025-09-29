import React from 'react';
import { formatNumber } from '../utils/formatters';

const ProfileHeader = ({ profile }) => (
  <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
    <div className="flex flex-col md:flex-row items-start gap-6">
      <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(profile.profilePictureUrl)}`} alt={profile.fullName} className="w-32 h-32 rounded-full border-4 border-gray-700" />
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{profile.fullName}</h1>
            <h2 className="text-xl lg:text-2xl font-mono text-gray-400">@{profile.username}</h2>
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-sm text-gray-400">
            <span>{formatNumber(profile.postsCount)} Posts</span>
            <span>{formatNumber(profile.followers)} Followers</span>
            <span>{formatNumber(profile.following)} Following</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
