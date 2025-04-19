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
    
    try {
      // Existing login logic
      // ...
      
      // Store user email in localStorage
      localStorage.setItem('userEmail', email);
      console.log(`Stored user email in localStorage: ${email}`);
      
      // Redirect to dashboard
      navigate('/student/dashboard');
    } catch (err) {
      // Error handling
    }
  };

  return (
    <div>
      {/* Render your login form here */}
    </div>
  );
};

export default Login; 