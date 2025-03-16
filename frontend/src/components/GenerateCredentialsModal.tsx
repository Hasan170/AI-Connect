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
  dob: string;
  board: string;
}

interface Teacher {
  _id: string;
  name: string;
  subject: string;
}

const GenerateCredentialsModal: React.FC<GenerateCredentialsModalProps> = ({ isOpen, onClose, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    subject: '',
    board: '',
    password: '',
    confirmPassword: '',
    teacherId: ''
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.fullName || '',
        email: student.email || '',
        grade: student.grade || '',
        subject: student.subject || '',
        board: student.board || '',
        password: '',
        confirmPassword: '',
        teacherId: ''
      });
      fetchTeachers();
    }
  }, [student]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher/details'); 
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.teacherId) {
      alert("Please assign a teacher!");
      return;
    }

    try {
      const payload = {
        requestId: student?.id,
        name: formData.name,
        email: formData.email,
        grade: formData.grade,
        board: formData.board,
        password: formData.password,
        subjects: [
          {
            subject: formData.subject,
            teacherId: formData.teacherId
          }
        ]
      };
      console.log('Payload:', payload);

      await api.post('/student/create', payload);
      alert('Student credentials created successfully!');
      if (student) {
        onSuccess(student.id);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error('Error creating student:', error);
      alert('Failed to create student. Please try again.');
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
              readOnly
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
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                required
                readOnly
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
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
              disabled={loading} // Disable while fetching data
            >
              <option value="">{loading ? "Loading teachers..." : "Select a teacher"}</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))
              ) : (
                !loading && <option disabled>No teachers available</option>
              )}
            </select>

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
              // minLength={6}
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
              // minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateCredentialsModal;