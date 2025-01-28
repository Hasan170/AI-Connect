import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'About Us', href: '/about' },
    { label: 'How it Works?', href: '/how-it-works' },
    { label: 'Become a Tutor', href: '/become-tutor' },
    { label: 'Book a Class', href: '/book-class' },
  ];

  return (
    <nav className="bg-navbar py-4 px-6 fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">AI Connect</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-white hover:text-card transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="bg-button-primary text-white px-4 py-2 rounded-lg hover:bg-button-secondary transition-colors flex items-center gap-2"
          >
            <User size={18} />
            Login
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-navbar p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block py-2 text-white hover:text-card transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="block py-2 text-white hover:text-card transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;