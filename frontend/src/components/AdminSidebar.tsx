import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin-dashboard' },
    { title: 'Students', icon: <GraduationCap size={20} />, path: '/admin/students' },
    { title: 'Subject Requests', icon: <BookOpen size={20} />, path: '/admin/subject-requests' },
    { title: 'Teachers', icon: <Users size={20} />, path: '/admin/teachers' },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/admin/feedback' },
    { title: 'Resources', icon: <BookOpen size={20} />, path: '/admin/resources' },
  ];
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
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

export default AdminSidebar;