import React, { useState, useEffect } from 'react';
import { Smile, Users, Brain, ShieldCheck, Award, Home, Clock, Tv, AtSign, MessageCircle, BarChart2 as BarChartIcon, UserCircle, Settings, Tag, Zap, Star, TrendingUp, PieChart as PieChartIcon, Sun, Eye, Repeat } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const iconMap = {
  sentiment: Smile, extrovert: Users, cognizant: Brain, risk: ShieldCheck, 'fair-play': Award,
  home: Home, clock: Clock, tv: Tv, atSign: AtSign, messageCircle: MessageCircle, barChart: BarChartIcon,
};

const App = () => {
  const [username, setUsername] = useState('youtube'); 
  const [inputValue, setInputValue] = useState('youtube');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async (user) => {
    if (!user) {
      setError("Please enter a username.");
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/influencer/${user}`;
      console.log(`Fetching data from: ${apiUrl}`); 

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || `API request failed with status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);

    } catch (err) {
      console.error("API fetch error:", err);
      setError(err.message || "Failed to fetch profile data. The account may not exist or the scraper might be blocked.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(username);
  }, [username]);

  const handleFetchClick = (e) => {
    e.preventDefault();
    setUsername(inputValue);
  };

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto mb-6">
        <form onSubmit={handleFetchClick} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Instagram Username"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full md:w-1/3 ring-1 ring-white/10 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Profile'}
          </button>
        </form>
      </div>
      
      {error && !loading && <div className="max-w-[1400px] mx-auto mb-4 text-center bg-red-900/50 text-red-300 text-sm py-2 px-4 rounded-lg">{error}</div>}
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        <Sidebar />
        <main className="col-span-12 lg:col-span-11">
          {loading ? (
            <div className="text-center py-20">Loading Profile...</div>
          ) : profile ? (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8">
                <ProfileHeader profile={profile} />
              </div>
              <div className="col-span-12 xl:col-span-4">
                <EngagementPanel analytics={profile.engagementAnalytics} />
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
            </div>
          ) : (
             <div className="text-center py-20 text-gray-500">Enter a username to get started.</div>
          )}
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

const Sidebar = () => ( <aside className="col-span-12 lg:col-span-1 bg-gray-900/50 ring-1 ring-white/10 rounded-2xl p-2 flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-6"> <div className="p-2 bg-blue-500 rounded-lg text-white font-bold">In</div> <NavIcon iconName="home" /> <NavIcon iconName="clock" /> <NavIcon iconName="tv" /> <NavIcon iconName="atSign" /> <NavIcon iconName="messageCircle" /> <NavIcon iconName="barChart" /> <div className="hidden lg:block flex-grow"></div> <UserCircle className="w-6 h-6 text-gray-400" /> <Settings className="w-6 h-6 text-gray-400" /> </aside> );
const NavIcon = ({ iconName }) => { const Icon = iconMap[iconName]; return <Icon className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />; };

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

const EngagementPanel = ({ analytics }) => {
    if (!analytics) return null;
    const getEngagementColor = (level) => {
      if (level === 'High') return 'text-green-400';
      if (level === 'Medium') return 'text-yellow-400';
      if (level === 'Low') return 'text-red-400';
      return 'text-gray-400';
    };
    return (
        <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full flex flex-col">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engagement Analytics</h2>
            <div className="space-y-4 text-sm flex-grow">
                <div className="flex justify-between items-center"><span className="text-gray-400">Avg Likes / Post</span><span className="font-bold text-white text-lg">{formatNumber(analytics.avgLikes)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Avg Comments / Post</span><span className="font-bold text-white text-lg">{formatNumber(analytics.avgComments)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Engagement Rate</span><span className={`font-bold text-lg ${getEngagementColor(analytics.engagementLevel)}`}>{analytics.engagementRate.toFixed(2)}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Engagement Level</span><span className={`font-bold text-lg ${getEngagementColor(analytics.engagementLevel)}`}>{analytics.engagementLevel}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Based on the last 10 posts.</p>
        </div>
    );
};

const EngagementTrendChart = ({ data }) => {
  const chartData = [...data].reverse().map((post, index) => ({
    name: `Post ${index + 1}`,
    likes: post.likes,
    comments: post.comments,
  }));

  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engagement Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
          <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const PostCategoryChart = ({ data }) => {
  const tagCounts = data
    .flatMap(p => p.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Post Categories</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const PostGrid = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl"><h2 className="text-white">No recent posts found.</h2></div>
    }
    return (
        <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Posts & AI Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {posts.map(post => (
                    <div key={post.id || post.shortcode} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                        <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(post.imageUrl)}`} className="w-full h-48 object-cover" alt={post.caption?.substring(0, 50)} />
                        <div className="p-4 flex flex-col flex-grow">
                           <div className="flex justify-between font-bold text-white text-sm mb-2">
                                <span>❤️ {formatNumber(post.likes)}</span>
                                <span>💬 {formatNumber(post.comments)}</span>
                           </div>
                           <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-grow">{post.caption || "No caption available."}</p>
                           {post.tags && (
                             <div className="text-xs space-y-2 border-t border-gray-700 pt-2 mt-auto">
                                <div className="flex items-center gap-2 text-yellow-400" title="Tags"><Tag size={14} />{post.tags.join(', ') || 'N/A'}</div>
                                <div className="flex items-center gap-2 text-cyan-400" title="Vibe"><Zap size={14} />{post.vibe || 'N/A'}</div>
                                {post.quality && (
                                  <>
                                    <div className="flex items-center gap-2 text-purple-400" title="Lighting"><Sun size={14} />{post.quality.lighting || 'N/A'}</div>
                                    <div className="flex items-center gap-2 text-pink-400" title="Visual Appeal"><Eye size={14} />{post.quality.visualAppeal || 'N/A'}</div>
                                    <div className="flex items-center gap-2 text-indigo-400" title="Consistency"><Repeat size={14} />{post.quality.consistency || 'N/A'}</div>
                                  </>
                                )}
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