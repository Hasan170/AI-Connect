import React from 'react';
import { Instagram, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-footer py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">AI Connect</h3>
          <p className="text-card">
            Empowering students through personalized education.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-card hover:text-white">About Us</a></li>
            <li><a href="#" className="text-card hover:text-white">Contact</a></li>
            <li><a href="#" className="text-card hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="text-card hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">For Students</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-card hover:text-white">Book Your Class</a></li>
            <li><a href="#" className="text-card hover:text-white">Programs</a></li>
            <li><a href="#" className="text-card hover:text-white">Tutoring Programs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-card hover:text-white">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-card hover:text-white">
              <Phone size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-card">
        <p className="text-center text-card">
          © {new Date().getFullYear()} AI Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;