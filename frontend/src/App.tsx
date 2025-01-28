import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import BecomeTutor from './pages/BecomeTutor';
import BookClass from './pages/BookClass';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import TutorProfile from './pages/TutorProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/become-tutor" element={<BecomeTutor />} />
            <Route path="/book-class" element={<BookClass />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/tutor-profile" element={<TutorProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;