import React from 'react';

const AboutUs = () => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            At AI Connect, we are dedicated to providing exceptional education
            tailored to the needs of students preparing for various academic
            challenges. Our mission is to empower students with the knowledge, skills,
            and confidence they need to excel in their studies and beyond.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Students studying"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;