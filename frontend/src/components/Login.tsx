import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5001/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      console.log('Login successful - raw response:', data);
      
      // Store authentication data
      const userData = {
        email: data.student.email,
        name: data.student.name,
        id: data.student.id,
        grade: data.student.grade,
        board: data.student.board,
        role: 'student'
      };
      
      console.log('Processed user data to store:', userData);
      
      // Store authentication info in localStorage consistently
      localStorage.setItem('token', 'auth-token-' + Date.now());
      
      // Store the complete user object
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Store individual fields for backward compatibility with all possible key names
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('studentEmail', userData.email);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('name', userData.name);
      localStorage.setItem('userGrade', userData.grade || '');
      localStorage.setItem('grade', userData.grade || '');
      localStorage.setItem('userBoard', userData.board || '');
      localStorage.setItem('board', userData.board || '');
      localStorage.setItem('userId', userData.id || '');
      
      // Verify data was stored correctly
      console.log("Verifying localStorage data after login:");
      console.log("- currentUser:", localStorage.getItem('currentUser'));
      console.log("- studentEmail:", localStorage.getItem('studentEmail'));
      console.log("- userEmail:", localStorage.getItem('userEmail'));
      console.log("- userName:", localStorage.getItem('userName'));
      console.log("- name:", localStorage.getItem('name'));
      
      console.log('User data stored in localStorage');
      
      // Redirect to dashboard
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 