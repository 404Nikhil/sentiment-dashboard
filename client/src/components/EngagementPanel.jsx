import React from 'react';
import { formatNumber } from '../utils/formatters';

const EngagementPanel = ({ analytics }) => {
    if (!analytics) return null;
    const getEngagementColor = (level) => {
      if (level === 'High') return 'text-green-400';
      if (level === 'Medium') return 'text-yellow-400';
      if (level === 'Low') return 'text-red-400';
      return 'text-gray-400';
    };
    return (
        <div className="bg-card ring-1 ring-white/10 p-6 rounded-2xl h-full flex flex-col">
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

export default EngagementPanel;
