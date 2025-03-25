import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatSupportWidget from './components/ChatSupportWidget';
import AIChatWidget from './components/AIChatWidget';

//main pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import BecomeTutor from './pages/BecomeTutor';
import BookClass from './pages/BookClass';
import Login from './pages/Login';

//sub pages
import StudentProfile from './pages/StudentProfile';
import TutorProfile from './pages/TutorProfile';
import AdminDashboard from './pages/AdminDashboard';

//admin pages
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Resources from './pages/admin/Resources';

//student pages
import MyClasses from './pages/student/MyClasses';
import Schedule from './pages/student/Schedule';
import Assignments from './pages/student/Assignments';
import TeachersPage from './pages/student/Teachers';
import ResourcesPage from './pages/student/Resources';
import FeeDetails from './pages/student/FeeDetails';
import Feedback from './pages/student/Feedback';
import MyCourses from './pages/student/MyCourses';

// //tutor pages
// import TutorStudents from './pages/tutro/TutorStudents';
// import TutorClasses from './pages/tutor/TutorClasses';
// import TutorSchedule from './pages/tutor/TutorSchedule';
// import TutorResources from './pages/tutor/TutorResources';



function App() {
  const location = useLocation();
  const showFooter = !['/admin-dashboard', '/student-profile', '/tutor-profile', '/admin/students', '/admin/teachers', '/admin/resources', '/admin/settings',
    '/student/classes', '/student/schedule', '/student/assignments', '/student/teachers', '/student/resources', '/student/fee-details', '/student/feedback', '/student/MyCourses',
  ].includes(location.pathname);

  return (
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
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/resources" element={<Resources />} />
          <Route path="/student/classes" element={<MyClasses />} />
          <Route path="/student/schedule" element={<Schedule />} />
          <Route path="/student/assignments" element={<Assignments />} />
          <Route path="/student/teachers" element={<TeachersPage />}  />
          <Route path="/student/resources" element={<ResourcesPage />} />
          <Route path="/student/fee-details" element={<FeeDetails />} />
          <Route path="/student/feedback" element={<Feedback />} />
          <Route path="/student/MyCourses" element={<MyCourses />} />


        </Routes>
      </main>
      {showFooter && <Footer />}
      <AIChatWidget />
      <ChatSupportWidget />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;