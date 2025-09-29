import React from 'react';
import ProfileHeader from './ProfileHeader';
import EngagementPanel from './EngagementPanel';
import AudienceDemographics from './AudienceDemographics';
import EngagementTrendChart from './EngagementTrendChart';
import PostCategoryChart from './PostCategoryChart';
import PostGrid from './PostGrid';
import ReelsGrid from './ReelsGrid';

const Dashboard = ({ profile, loading, error }) => {
  if (loading) {
    return <div className="text-center py-20">Loading Profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-500">Enter a username to get started.</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <ProfileHeader profile={profile} />
      </div>
      <div className="col-span-12 xl:col-span-4">
        <EngagementPanel analytics={profile.engagementAnalytics} />
      </div>
      <div className="col-span-12">
        <AudienceDemographics demographics={profile.audienceDemographics} />
      </div>
      <div className="col-span-12 lg:col-span-7">
        <EngagementTrendChart data={profile.recentPosts} />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <PostCategoryChart data={profile.recentPosts} />
      </div>
      <div className="col-span-12">
        <PostGrid posts={profile.recentPosts} />
      </div>
      <div className="col-span-12">
        <ReelsGrid reels={profile.recentReels} />
      </div>
    </div>
  );
};

export default Dashboard;
