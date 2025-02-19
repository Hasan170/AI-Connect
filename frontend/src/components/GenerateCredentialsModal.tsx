import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import { AxiosError } from 'axios';

interface GenerateCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentBooking | null;
  onSuccess: (studentId: string) => void;
}

interface StudentBooking {
  id: string;
  fullName: string;
  email: string;
  grade: string;
  subject: string;
  date: string;
}

const GenerateCredentialsModal: React.FC<GenerateCredentialsModalProps> = ({ isOpen, onClose, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: student?.fullName || '',
    age: '',
    grade: student?.grade || '',
    board: '',
    subjects: student?.subject || '',
    email: student?.email || '',
    password: '',
    confirmPassword: ''
  });

    // Use useEffect to update formData when the student changes
    useEffect(() => {
      if (student) {
        setFormData({
          name: student.fullName || '',
          age: '',
          grade: student.grade || '',
          board: '',
          subjects: student.subject || '',
          email: student.email || '',
          password: '',
          confirmPassword: ''
        });
      }
    }, [student]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const payload = {
      requestId: student?.id,
      name: formData.name,
      age: formData.age,
      grade: formData.grade,
      board: formData.board,
      subjects: formData.subjects,
      email: formData.email,
      password: formData.password
    };

    try {
      console.log("🚀 Sending Payload:", payload); // Debugging log
      await api.post('/student/create', payload);
      alert('Student credentials created successfully!');
      // Inform the parent that this teacher's request is processed
      if (student) {
        onSuccess(student.id);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as AxiosError;
      alert('Failed to create student. Check console for details.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generate Credentials</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
            <input
              type="text"
              name="board"
              value={formData.board}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateCredentialsModal;