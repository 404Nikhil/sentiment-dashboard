import React, { useState, useEffect } from 'react';
import { Smile, Users, Brain, ShieldCheck, Award, Phone, Mail, Home, Clock, Tv, AtSign, MessageCircle, BarChart2, Briefcase, UserCircle, Settings, Tag, Zap, Star } from 'lucide-react';

const iconMap = {
  sentiment: Smile, extrovert: Users, cognizant: Brain, risk: ShieldCheck, 'fair-play': Award,
  home: Home, clock: Clock, tv: Tv, atSign: AtSign, messageCircle: MessageCircle, barChart: BarChart2,
};

const App = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/influencer/youtube`;
        
        console.log(`Fetching data from: ${apiUrl}`); 

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);

      } catch (err) {
        console.warn("API fetch failed, falling back to mock data.", err);
        try {
          const fallbackResponse = await fetch('/mockProfile.json');
          const fallbackData = await fallbackResponse.json();
          setProfile(fallbackData);
          setError("Live data could not be loaded. Displaying static mock data.");
        } catch (fallbackErr) {
          console.error("Failed to load mock data as well:", fallbackErr);
          setError("A critical error occurred. Could not load any profile data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <div className="bg-black text-white min-h-screen flex items-center justify-center font-sans"><p>Loading Profile...</p></div>;
  if (!profile) return <div className="bg-black text-white min-h-screen flex items-center justify-center font-sans"><p>{error || "Profile data is unavailable."}</p></div>;

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans p-4 lg:p-6">
       {error && <div className="max-w-[1400px] mx-auto mb-4 text-center bg-yellow-900/50 text-yellow-300 text-sm py-2 px-4 rounded-lg">{error}</div>}
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        <Sidebar />
        <main className="col-span-12 lg:col-span-11">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-9">
              <ProfileHeader profile={profile} />
            </div>
            <div className="col-span-12 xl:col-span-3">
              <EngagementPanel analytics={profile.engagementAnalytics} />
            </div>
            <div className="col-span-12">
              <PostGrid posts={profile.recentPosts} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
};

const Sidebar = () => ( <aside className="col-span-12 lg:col-span-1 bg-gray-900/50 ring-1 ring-white/10 rounded-2xl p-2 flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-6"> <div className="p-2 bg-blue-500 rounded-lg text-white">B</div> <NavIcon iconName="home" /> <NavIcon iconName="clock" /> <NavIcon iconName="tv" /> <NavIcon iconName="atSign" /> <NavIcon iconName="messageCircle" /> <NavIcon iconName="barChart" /> <div className="hidden lg:block flex-grow"></div> <UserCircle className="w-6 h-6 text-gray-400" /> <Settings className="w-6 h-6 text-gray-400" /> </aside> );
const NavIcon = ({ iconName }) => { const Icon = iconMap[iconName]; return <Icon className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />; };

const ProfileHeader = ({ profile }) => {
  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(profile.profilePictureUrl)}`} alt={profile.fullName} className="w-32 h-32 rounded-full border-4 border-gray-700" />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{profile.fullName}</h1>
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
};

const EngagementPanel = ({ analytics }) => {
    if (!analytics) return null;
    return (
        <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full flex flex-col">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engagement Analytics</h2>
            <div className="space-y-4 text-sm flex-grow">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Likes / Post</span>
                    <span className="font-bold text-white text-lg">{formatNumber(analytics.avgLikes)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Comments / Post</span>
                    <span className="font-bold text-white text-lg">{formatNumber(analytics.avgComments)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Engagement Rate</span>
                    <span className="font-bold text-green-400 text-lg">{analytics.engagementRate.toFixed(2)}%</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Based on the last 10 posts.</p>
        </div>
    );
};

const PostGrid = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl"><h2 className="text-white">No recent posts found.</h2></div>
    }
    return (
        <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map(post => (
                    <div key={post.id || post.shortcode} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                        <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(post.imageUrl)}`} className="w-full h-48 object-cover" alt={post.caption} />
                        <div className="p-4 flex flex-col flex-grow">
                           <div className="flex justify-between font-bold text-white text-sm mb-2">
                                <span>❤️ {formatNumber(post.likes)}</span>
                                <span>💬 {formatNumber(post.comments)}</span>
                           </div>
                           <p className="text-xs text-gray-400 line-clamp-3 mb-3 flex-grow">{post.caption || "No caption available."}</p>
                           {post.tags && (
                             <div className="text-xs space-y-2 border-t border-gray-700 pt-2 mt-auto">
                                <div className="flex items-center gap-2 text-yellow-400"><Tag size={14} /> Tags: {post.tags.join(', ') || 'N/A'}</div>
                                <div className="flex items-center gap-2 text-cyan-400"><Zap size={14} /> Vibe: {post.vibe || 'N/A'}</div>
                                <div className="flex items-center gap-2 text-purple-400"><Star size={14} /> Quality: {post.quality || 'N/A'}</div>
                             </div>
                           )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;