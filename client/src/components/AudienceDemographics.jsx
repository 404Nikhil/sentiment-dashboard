import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const AudienceDemographics = ({ demographics }) => {
  if (!demographics || !demographics.genderSplit || demographics.genderSplit.length === 0) {
    return (
      <div className="col-span-12 bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Audience Demographics</h2>
        <p className="text-gray-500">Audience demographics data is not available.</p>
      </div>
    );
  }

  const GENDER_COLORS = ['#8884d8', '#82ca9d'];
  const AGE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Audience Demographics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender Split */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">GENDER SPLIT</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={demographics.genderSplit}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {demographics.genderSplit.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Groups */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">AGE GROUPS</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={demographics.ageGroups} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke="#6b7280" width={50} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
              <Bar dataKey="value" name="Percentage" fill="#8884d8">
                {demographics.ageGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Geographies */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">TOP GEOGRAPHIES</h3>
          <div className="w-full space-y-3 pt-4">
              {demographics.topGeographies.map((geo, index) => (
                  <div key={index} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">{geo.name}</span>
                          <span className="font-bold text-white">{geo.value}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${geo.value}%` }}></div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDemographics;
