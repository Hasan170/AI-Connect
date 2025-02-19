import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import { AxiosError } from 'axios';

interface GenerateTeacherCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherApplication | null;
  onSuccess: (teacherId: string) => void; // callback to inform parent on success
}

interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  experience: string;
  qualification: string;
  applicationDate: string;
}

const GenerateTeacherCredentialsModal: React.FC<GenerateTeacherCredentialsModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: teacher?.fullName || '',
    age: '',
    subject: teacher?.subject || '',
    experience: teacher?.experience || '',
    qualification: teacher?.qualification || '',
    email: teacher?.email || '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.fullName || '',
        age: '',
        subject: teacher.subject || '',
        experience: teacher.experience || '',
        qualification: teacher.qualification || '',
        email: teacher.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [teacher]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const payload = {
      requestId: teacher?.id,
      name: formData.name,
      email: formData.email,
      expertise: formData.subject,
      experience: parseInt(formData.experience) || 0,
      qualification: formData.qualification,
      password: formData.password
    };

    try {
      console.log("🚀 Sending Payload:", payload); // Debugging log
      await api.post('/teacher/create', payload);
      alert('Teacher credentials created successfully!');
      // Inform the parent that this teacher's request is processed
      if (teacher) {
        onSuccess(teacher.id);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as AxiosError;
      alert('Failed to create teacher. Check console for details.');
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
          {/* All your form inputs here */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
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
          {/* Repeat for Age, Subject, Experience, Qualification, Email, Password, Confirm Password */}
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

export default GenerateTeacherCredentialsModal;
