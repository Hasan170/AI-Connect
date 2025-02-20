import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReschedule?: boolean;
  rescheduleData?: { id: string; date: string; time: string };
  subject?: string;
}

const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
  isOpen,
  onClose,
  isReschedule = false,
  rescheduleData,
  subject
}) => {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (isReschedule && rescheduleData) {
      setSelectedDate(rescheduleData.date);
    }
  }, [isReschedule, rescheduleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReschedule && rescheduleData) {
      // Handle rescheduling logic here
      console.log('Rescheduled class:', { id: rescheduleData.id, date: selectedDate });
    } else {
      // Handle scheduling logic here
      console.log('Requested class:', { subject, date: selectedDate });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {isReschedule ? 'Reschedule Class' : 'Request Class'}: {subject}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            {isReschedule ? 'Reschedule' : 'Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleClassModal;