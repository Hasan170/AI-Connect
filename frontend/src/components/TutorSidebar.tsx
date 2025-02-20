import React from 'react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings,
  LogOut,
  FileText
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TutorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: <User size={20} />, path: '/tutor-profile' },
    { title: 'My Classes', icon: <BookOpen size={20} />, path: '/tutor/classes' },
    { title: 'Schedule', icon: <Calendar size={20} />, path: '/tutor/schedule' },
    { title: 'Students', icon: <Users size={20} />, path: '/tutor/students' },
    { title: 'Resources', icon: <FileText size={20} />, path: '/tutor/resources' },
    { title: 'Earnings', icon: <DollarSign size={20} />, path: '/tutor/earnings' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/tutor/settings' },
  ];

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
        </div>
        <button 
          className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 mb-4"
          onClick={() => {
            localStorage.removeItem('teacherEmail');
            navigate('/login');
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TutorSidebar;