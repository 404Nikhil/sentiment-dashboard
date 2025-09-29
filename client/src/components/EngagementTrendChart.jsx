import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

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

export default EngagementTrendChart;
