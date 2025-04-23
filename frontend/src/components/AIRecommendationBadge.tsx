import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIRecommendationBadgeProps {
  showTooltip?: boolean;
}

const AIRecommendationBadge: React.FC<AIRecommendationBadgeProps> = ({ 
  showTooltip = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to parent
    >
      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs py-1 px-2 rounded-full">
        <Sparkles size={12} className="animate-pulse" />
        <span className="font-medium">AI Recommended</span>
      </div>
      
      {showTooltip && isHovered && (
        <div className="absolute -bottom-14 left-0 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg z-10">
          Personalized recommendations based on your quiz performance
        </div>
      )}
    </div>
  );
};

export default AIRecommendationBadge; 