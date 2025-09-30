import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementTrendChart = ({ posts, reels }) => {
  const combinedData = [...(posts || []), ...(reels || [])];

  if (!combinedData || combinedData.length === 0) return null;

  // FIX: Each data point now has a unique name for the X-axis.
  const chartData = combinedData.map((post, index) => ({
    name: `Post ${index + 1}`,
    likes: post.likes,
    comments: post.comments,
  })).reverse();

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-full">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Engagement Trend (Posts & Reels)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke="#6E6E73" tick={{ fill: '#6E6E73' }} />
          <YAxis stroke="#6E6E73" tick={{ fill: '#6E6E73' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E5E5EA',
              color: '#1D1D1F'
            }} 
          />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#007AFF" name="Likes" />
          <Line type="monotone" dataKey="comments" stroke="#34C759" name="Comments" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTrendChart;