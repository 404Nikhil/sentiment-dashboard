import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PostCategoryChart = ({ posts, reels }) => {
    const combinedData = [...(posts || []), ...(reels || [])];

  if (!combinedData || combinedData.length === 0) return null;

  const tagCounts = combinedData
    .flatMap(p => p.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#58A6FF', '#3FB950', '#F778BA', '#A371F7', '#E3B341', '#1F6FEB'];

  if (chartData.length === 0) {
    return (
       <div className="bg-card border border-border p-6 rounded-2xl h-full">
         <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Post Categories (Posts & Reels)</h2>
         <div className="flex items-center justify-center h-full text-text-secondary">No category data to display.</div>
       </div>
    )
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-full">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Post Categories (Posts & Reels)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            labelLine={false} 
            outerRadius={80} 
            fill="#8884d8" 
            dataKey="value" 
            nameKey="name" 
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* <Tooltip 
            contentStyle={{ 
              backgroundColor: '#161B22', 
              border: '1px solid #30363D',
              color: '#E6EDF3'
            }} 
          /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostCategoryChart;