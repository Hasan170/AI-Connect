import React from 'react';

const Vision = () => {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Study materials"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Our vision is to be a pioneering educational institution known for
            delivering personalized tutoring that meets the unique needs of each
            student. We aim to create a supportive and engaging learning
            environment where every student can thrive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vision;