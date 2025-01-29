import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';

interface Student {
  id: string;
  name: string;
}

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReschedule?: boolean;
  rescheduleData?: { id: string; date: string; time: string };
}

const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
  isOpen,
  onClose,
  isReschedule = false,
  rescheduleData
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    // Fetch students from the database
    const fetchStudents = async () => {
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (isReschedule && rescheduleData) {
      setSelectedDate(rescheduleData.date);
      setSelectedTime(rescheduleData.time);
    }
  }, [isReschedule, rescheduleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReschedule && rescheduleData) {
      // Handle rescheduling logic here
      console.log('Rescheduled class:', { id: rescheduleData.id, date: selectedDate, time: selectedTime });
    } else {
      // Handle scheduling logic here
      console.log('Scheduled class:', { studentId: selectedStudent, subject: selectedSubject, date: selectedDate, time: selectedTime });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{isReschedule ? 'Reschedule Class' : 'Schedule Class'}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isReschedule && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!isReschedule && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
                placeholder="Enter subject"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            {isReschedule ? 'Reschedule' : 'Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleClassModal;