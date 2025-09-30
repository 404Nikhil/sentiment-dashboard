import React from 'react';
import { Smile, Users, Brain, ShieldCheck, Award, Home, Clock, Tv, AtSign, MessageCircle, BarChart2 as BarChartIcon, UserCircle, Settings } from 'lucide-react';

const iconMap = {
  sentiment: Smile, extrovert: Users, cognizant: Brain, risk: ShieldCheck, 'fair-play': Award,
  home: Home, clock: Clock, tv: Tv, atSign: AtSign, messageCircle: MessageCircle, barChart: BarChartIcon,
};

const NavIcon = ({ iconName }) => { 
  const Icon = iconMap[iconName]; 
  return <Icon className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />; 
};

const Sidebar = () => (
  <aside className="col-span-12 lg:col-span-1 bg-card ring-1 ring-white/10 rounded-2xl p-2 flex lg:flex-col items-center justify-around lg:justify-start lg:space-y-6">
    <div className="p-2 bg-blue-500 rounded-lg text-white font-bold">In</div>
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

export default Sidebar;
