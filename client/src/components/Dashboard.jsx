import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import EngagementPanel from './EngagementPanel';
import AudienceDemographics from './AudienceDemographics';
import EngagementTrendChart from './EngagementTrendChart';
import PostCategoryChart from './PostCategoryChart';
import PostGrid from './PostGrid';
import ReelsGrid from './ReelsGrid';
import PostModal from './PostModal';

const Dashboard = ({ profile, loading, error }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePostClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="text-center py-20">Loading Profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>
  }

  if (!profile) {
    return <div className="text-center py-20 text-text-secondary">Enter a username to get started.</div>;
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
        <EngagementTrendChart posts={profile.recentPosts} reels={profile.recentReels} />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <PostCategoryChart posts={profile.recentPosts} reels={profile.recentReels} />
      </div>
      <div className="col-span-12">
        <PostGrid posts={profile.recentPosts} onPostClick={handlePostClick} />
      </div>
      <div className="col-span-12">
        <ReelsGrid reels={profile.recentReels} onReelClick={handlePostClick} />
      </div>
      {isModalOpen && <PostModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  );
};

export default Dashboard;