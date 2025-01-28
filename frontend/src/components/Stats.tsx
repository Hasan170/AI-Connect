import React, { useEffect, useState } from 'react';

const Stats = () => {
  const [animated, setAnimated] = useState(false);
  const stats = [
    { value: 5000, label: "Students Taught", symbol: "+" },
    { value: 200, label: "Expert Tutors", symbol: "+" },
    { value: 98, label: "Satisfaction Rate", symbol: "%" },
    { value: 15000, label: "Learning Hours", symbol: "+" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('stats-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !animated) {
          setAnimated(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  return (
    <div id="stats-section" className="py-16 bg-navbar">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <p className="text-4xl font-bold text-white mb-2">
                {animated ? (
                  <>
                    {stat.value.toLocaleString()}
                    {stat.symbol}
                  </>
                ) : (
                  "0"
                )}
              </p>
              <p className="text-card">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;