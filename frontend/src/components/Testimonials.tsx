import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules';

const testimonials = [
  {
    quote: "AI Connect has completely transformed my learning experience. The tutors are incredibly knowledgeable and patient.",
    author: "John Doe",
    role: "High School Student"
  },
  {
    quote: "I was struggling with math, but thanks to AI Connect, I now feel confident and prepared for my exams.",
    author: "Jane Smith",
    role: "College Student"
  },
  {
    quote: "The personalized attention I received from my tutor was amazing. I highly recommend AI Connect to anyone looking to improve their grades.",
    author: "Emily Johnson",
    role: "University Student"
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 px-6 bg-background text-text-primary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Student Testimonials</h2>
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-card p-6 rounded-lg shadow-md text-center">
                <p className="text-lg mb-4 text-text-primary">{testimonial.quote}</p>
                <div className="mt-4">
                  <p className="font-semibold text-text-primary">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-text-secondary text-sm">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-16"></div> {/* Add space after the cards */}
    </div>
  );
};

export default Testimonials;