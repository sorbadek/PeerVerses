
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface TimeSpentChartProps {
  reputationScore: number;
  isVerified: boolean;
}

const TimeSpentChart: React.FC<TimeSpentChartProps> = ({ reputationScore, isVerified }) => {
  const data = [
    { day: 'SAT', hours: 2 },
    { day: 'SUN', hours: 4 },
    { day: 'MON', hours: 3 },
    { day: 'TUE', hours: 3.5 },
    { day: 'WED', hours: 5 },
    { day: 'THU', hours: 4 },
    { day: 'FRI', hours: 3.5 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Time Spent</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Reputation: {reputationScore}</span>
          {isVerified && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Verified
            </span>
          )}
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Bar 
              dataKey="hours" 
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Week</span>
        <span>Month</span>
        <span>Year</span>
      </div>
    </div>
  );
};

export default TimeSpentChart;
