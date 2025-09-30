import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// Custom Tooltip for better styling and visibility
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-100 text-gray-900 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold">{`${payload[0].name} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


const AudienceDemographics = ({ demographics }) => {
  if (!demographics || !demographics.genderSplit || demographics.genderSplit.length === 0) {
    return (
      <div className="col-span-12 bg-card border border-border p-6 rounded-2xl">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Audience Demographics</h2>
        <p className="text-text-secondary">Audience demographics data is not available.</p>
      </div>
    );
  }

  const GENDER_COLORS = ['#58A6FF', '#3FB950']; // Using primary blue and a green
  const AGE_COLORS = ['#58A6FF', '#3FB950', '#F778BA', '#A371F7', '#E3B341', '#1F6FEB'];

  return (
    <div className="bg-card border border-border p-6 rounded-2xl">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Audience Demographics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender Split */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-text-secondary mb-2">GENDER SPLIT</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={demographics.genderSplit}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70} // Reduced radius to prevent clipping
                innerRadius={50} // Added inner radius to create a donut chart
                paddingAngle={5}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {demographics.genderSplit.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Groups */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-text-secondary mb-2">AGE GROUPS</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={demographics.ageGroups} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke="#8B949E" width={50} tick={{ fill: '#8B949E' }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
              <Bar dataKey="value" name="Percentage" fill="#58A6FF" radius={[0, 4, 4, 0]}>
                {demographics.ageGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Geographies */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-semibold text-text-secondary mb-2">TOP GEOGRAPHIES</h3>
          <div className="w-full space-y-3 pt-4">
              {demographics.topGeographies.map((geo, index) => (
                  <div key={index} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-text-primary">{geo.name}</span>
                          <span className="font-bold text-text-primary">{geo.value}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${geo.value}%` }}></div>
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