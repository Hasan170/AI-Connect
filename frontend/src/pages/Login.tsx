import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [userType, setUserType] = useState<'student' | 'tutor' | 'admin' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userType === 'admin') {
        // Hardcoded admin credentials for demo
        if (email === 'admin@aiconnect.com' && password === 'admin123') {
          localStorage.setItem('adminEmail', email);
          navigate('/admin-dashboard');
        } else {
          alert('Invalid admin credentials');
        }
      } else {
        const endpoint = userType === 'student' ? '/student/login' : '/teacher/login';
        const response = await api.post(endpoint, { email, password });

        if (response.data.message === 'Student logged in successfully' || 
            response.data.message === 'Teacher logged in successfully') {
          if (userType === 'student') {
            localStorage.setItem('studentEmail', email);
            navigate('/student-profile');
          } else if (userType === 'tutor') {
            localStorage.setItem('teacherEmail', email);
            navigate('/tutor-profile');
          }
        } else {
          alert('Invalid email or password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    console.log('Google login clicked');
  };

  return (
    <div className="pt-24 pb-16 px-6 bg-background min-h-screen flex flex-col items-center">
      <div className="max-w-md w-full mx-auto mb-16">
        <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
          {!userType ? (
            <>
              <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
                Welcome to AI Connect
              </h1>
              <p className="text-lg mb-8 text-text-primary text-center">Choose your role to login</p>
              
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-300 bg-navbar text-white hover:bg-opacity-90"
                  onClick={() => setUserType('student')}
                >
                  <User size={20} />
                  Student
                </button>
                <button
                  className="px-6 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-300 bg-footer text-white hover:bg-opacity-90"
                  onClick={() => setUserType('tutor')}
                >
                  <UserPlus size={20} />
                  Tutor
                </button>
                <button
                  className="px-6 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-300 bg-gray-600 text-white hover:bg-opacity-90"
                  onClick={() => setUserType('admin')}
                >
                  <User size={20} />
                  Admin
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setUserType(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-navbar transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <h2 className="text-2xl font-bold text-center flex-1">
                  {userType === 'student' ? 'Student' : userType === 'tutor' ? 'Tutor' : 'Admin'} Login
                </h2>
              </div>

              <form onSubmit={handleSubmit} className={`mb-8 p-6 rounded-lg shadow-lg ${
                userType === 'student' ? 'bg-navbar' : userType === 'tutor' ? 'bg-footer' : 'bg-gray-600'
              }`}>
                <div className="mb-4">
                  <label className="block text-left mb-2 text-white font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-2 text-white font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold transform hover:scale-[1.02]"
                  style={{ color: userType === 'student' ? '#245F73' : userType === 'tutor' ? '#733E24' : '#4B5563' }}
                >
                  Login 
                  <ArrowRight size={20} />
                </button>
              </form>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Or continue with</p>
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;