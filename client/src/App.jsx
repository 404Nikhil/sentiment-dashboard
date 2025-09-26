import React, { useState, useEffect } from 'react';
import { Smile, Users, Brain, ShieldCheck, Award, Phone, Mail, Home, Clock, Tv, AtSign, MessageCircle, BarChart2, Briefcase, UserCircle, Settings } from 'lucide-react';

const iconMap = {
  sentiment: Smile,
  extrovert: Users,
  cognizant: Brain,
  risk: ShieldCheck,
  'fair-play': Award,
  home: Home,
  clock: Clock,
  tv: Tv,
  atSign: AtSign,
  messageCircle: MessageCircle,
  barChart: BarChart2,
};

const App = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/mockProfile.json');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading || !profile) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center font-sans">
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        <Sidebar />
        <main className="col-span-12 lg:col-span-11">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-9">
              <ProfileHeader profile={profile} />
            </div>
            <div className="col-span-12 xl:col-span-3">
              <OccupationPanel occupation={profile.occupation} />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <PersonalityPanel personality={profile.personality} />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <InterestsPanel interests={profile.interests} />
            </div>
            <div className="col-span-12 xl:col-span-3">
              <PostAnalytics posts={profile.recentPosts} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Sidebar = () => (
  <aside className="col-span-12 lg:col-span-1 bg-gray-900/50 ring-1 ring-white/10 rounded-2xl p-2 flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-6">
    <div className="p-2 bg-blue-500 rounded-lg text-white">B</div>
    <NavIcon iconName="home" />
    <NavIcon iconName="clock" />
    <NavIcon iconName="tv" />
    <NavIcon iconName="atSign" />
    <NavIcon iconName="messageCircle" />
    <NavIcon iconName="barChart" />
    <div className="hidden lg:block flex-grow"></div>
    <UserCircle className="w-6 h-6 text-gray-400" />
    <Settings className="w-6 h-6 text-gray-400" />
  </aside>
);

const NavIcon = ({ iconName }) => {
  const Icon = iconMap[iconName];
  return <Icon className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />;
};

const ProfileHeader = ({ profile }) => {
  const StatIcon = ({ iconName }) => {
    const Icon = iconMap[iconName];
    return <Icon className="w-6 h-6" />;
  };

  const statColors = {
    sentiment: 'text-cyan-400',
    extrovert: 'text-green-400',
    cognizant: 'text-orange-400',
    risk: 'text-teal-400',
    'fair-play': 'text-pink-400',
  };

  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <img src={profile.profilePictureUrl} alt={profile.fullName} className="w-32 h-32 rounded-full border-4 border-gray-700" />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{profile.fullName}</h1>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-sm text-gray-400">
              <span>🇪🇸 {profile.location}</span>
              <span>{profile.age} YEARS OLD</span>
              <span>{profile.status}</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {profile.basicStats.map(stat => (
              <div key={stat.label} className={`flex flex-col items-center justify-center p-2 ${statColors[stat.icon]}`}>
                <StatIcon iconName={stat.icon} />
                <p className="mt-2 font-bold text-white text-xl">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OccupationPanel = ({ occupation }) => (
  <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full flex flex-col">
    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Occupation</h2>
    <div className="space-y-3 text-sm flex-grow">
      <div className="flex justify-between">
        <span className="text-gray-400">Job position</span>
        <span className="font-semibold text-white">{occupation.jobTitle}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Company</span>
        <span className="font-semibold text-white">{occupation.company}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Annual Income</span>
        <span className="font-semibold text-white">{occupation.annualIncome}</span>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      <button className="w-full bg-green-500 text-black font-bold py-2.5 rounded-lg hover:bg-green-600 transition duration-200 text-sm flex items-center justify-center gap-2"><Phone size={16} /> Call Now</button>
      <button className="w-full bg-gray-700 text-white font-bold py-2.5 rounded-lg hover:bg-gray-600 transition duration-200 text-sm flex items-center justify-center gap-2"><Mail size={16} /> Send Email</button>
    </div>
  </div>
);

const PersonalityPanel = ({ personality }) => (
  <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Personality</h2>
    <div className="space-y-5">
      {personality.map(trait => (
        <div key={trait.trait}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-white">{trait.trait}</span>
            <span className="text-gray-400">{trait.score}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${trait.score}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InterestsPanel = ({ interests }) => (
  <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full">
    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Interests</h2>
    <div className="flex flex-wrap gap-4 items-center justify-center pt-4">
      {interests.sort((a,b) => b.value - a.value).map(interest => (
        <div key={interest.name} className="relative flex items-center justify-center bg-gray-800/80 ring-1 ring-white/10 rounded-full text-white font-bold transition-transform hover:scale-105" style={{ width: `${interest.value * 1.6}px`, height: `${interest.value * 1.6}px` }}>
          <div className="text-center">
            <p className="text-lg">{interest.value}%</p>
            <p className="text-[10px] uppercase tracking-wider">{interest.name}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PostAnalytics = ({ posts }) => {
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full flex flex-col">
       <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Post Engagement</h2>
       <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2">
        {posts.map(post => (
          <img key={post.id} src={post.imageUrl} className="w-full h-full object-cover rounded-md" alt="Recent Post Thumbnail" />
        ))}
       </div>
       <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Likes (Last 6)</span>
            <span className="font-semibold text-white">{(totalLikes / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Comments (Last 6)</span>
            <span className="font-semibold text-white">{(totalComments / 1000).toFixed(1)}K</span>
          </div>
       </div>
    </div>
  )
}

export default App;