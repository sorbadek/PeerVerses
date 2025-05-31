
import React from 'react';
import TimeSpentChart from './TimeSpentChart';
import CourseCompletionChart from './CourseCompletionChart';

interface AnalyticsSectionProps {
  reputationScore: number;
  isVerified: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ reputationScore, isVerified }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TimeSpentChart reputationScore={reputationScore} isVerified={isVerified} />
      <CourseCompletionChart reputationScore={reputationScore} isVerified={isVerified} />
    </div>
  );
};

export default AnalyticsSection;
