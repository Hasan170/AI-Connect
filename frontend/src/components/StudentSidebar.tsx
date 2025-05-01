import React from 'react';
import { User, BookOpen, Calendar, ClipboardList, Users, FileText, DollarSign, MessageSquare, LogOut, Book, LineChart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBook } from "react-icons/fa";

interface StudentSidebarProps {
  onNotebookClick: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ onNotebookClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: <User size={20} />, path: '/student-profile' },
    { title: 'My Classes', icon: <BookOpen size={20} />, path: '/student/classes' },
    { title: 'Calendar', icon: <Calendar size={20} />, path: '/student/schedule' },
    { title: 'My Courses', icon: <FaBook size={20} />, path: '/student/Courses' }, 
    { title: 'Assignments', icon: <ClipboardList size={20} />, path: '/student/assignments' },
    { title: 'My Teachers', icon: <Users size={20} />, path: '/student/teachers' },
    { title: 'Resources', icon: <FileText size={20} />, path: '/student/resources' },
    { title: 'Fee Details', icon: <DollarSign size={20} />, path: '/student/fee-details' },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/student/feedback' },
  ];


  const handleLogout = () => {
    localStorage.removeItem('studentEmail');
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 pt-24">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-50 ${
                location.pathname === item.path ? 'bg-gray-50 text-navbar' : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <button
            onClick={onNotebookClick}
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
          >
            <Book size={20} />
            <span>Notebook</span>
          </button>
        </div>
        <button 
          className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 mb-4"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;