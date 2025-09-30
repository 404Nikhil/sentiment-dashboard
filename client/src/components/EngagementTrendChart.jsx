import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementTrendChart = ({ posts, reels }) => {
  const combinedData = [...(posts || []), ...(reels || [])];

  if (!combinedData || combinedData.length === 0) return null;

  const chartData = combinedData.map((post, index) => ({
    name: ``,
    likes: post.likes,
    comments: post.comments,
  })).reverse();

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-full">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Engagement Trend (Posts & Reels)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#8B949E" tick={{ fill: '#8B949E' }} />
          <YAxis stroke="#8B949E" tick={{ fill: '#8B949E' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#161B22', 
              border: '1px solid #30363D',
              color: '#E6EDF3'
            }} 
          />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#58A6FF" name="Likes" />
          <Line type="monotone" dataKey="comments" stroke="#3FB950" name="Comments" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTrendChart;