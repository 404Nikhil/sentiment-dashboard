import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PostCategoryChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const tagCounts = data
    .flatMap(p => p.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  if (chartData.length === 0) {
    return (
       <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl h-full">
         <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Post Categories</h2>
         <div className="flex items-center justify-center h-full text-gray-500">No category data to display.</div>
       </div>
    )
  }

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

export default PostCategoryChart;
