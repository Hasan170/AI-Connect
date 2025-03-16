import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReschedule?: boolean;
  rescheduleData?: { 
    id: string; 
    date: string; 
    time: string 
  };
  subject?: string;
  onSubmit: (date: Date, time?: string) => void;
}

const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
  isOpen,
  onClose,
  isReschedule = false,
  rescheduleData,
  subject,
  onSubmit
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isReschedule && rescheduleData) {
      setSelectedDate(rescheduleData.date);
      setSelectedTime(rescheduleData.time);
    }
  }, [isReschedule, rescheduleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (isReschedule && !selectedTime) {
      setError('Please select a time');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(new Date(selectedDate), selectedTime);
      onClose();
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {isReschedule ? 'Reschedule Class' : 'Request Class'}
            {subject && `: ${subject}`}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {isReschedule && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 w-full flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isReschedule ? 'Reschedule' : 'Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleClassModal;






// // components/ScheduleClassModal.tsx
// import React, { useState } from 'react';
// import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

// interface ScheduleClassModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isReschedule: boolean;
//   subject?: string;
//   rescheduleData?: {
//     id: string;
//     date: string;
//     time: string;
//   };
//   onSubmit: (date: Date, time?: string) => void;
// }

// const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
//   isOpen,
//   onClose,
//   isReschedule,
//   subject,
//   rescheduleData,
//   onSubmit
// }) => {
//   const [selectedDate, setSelectedDate] = useState(rescheduleData?.date || '');
//   const [selectedTime, setSelectedTime] = useState(rescheduleData?.time || '');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (!selectedDate) {
//       setError('Please select a date');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await onSubmit(new Date(selectedDate), selectedTime);
//       onClose();
//     } catch (err) {
//       setError('Failed to schedule class. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">
//             {isReschedule ? 'Reschedule Class' : 'Request Class'}
//           </h3>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
//                 required
//                 min={new Date().toISOString().split('T')[0]} // Disable past dates
//               />
//               <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           {isReschedule && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Time
//               </label>
//               <div className="relative">
//                 <input
//                   type="time"
//                   value={selectedTime}
//                   onChange={(e) => setSelectedTime(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
//                   required
//                 />
//                 <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
//           >
//             {isSubmitting && (
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             )}
//             {isReschedule ? 'Reschedule Class' : 'Request Class'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ScheduleClassModal;















// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import api from '../api';

// interface ScheduleClassModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isReschedule?: boolean;
//   rescheduleData?: { id: string; date: string; time: string };
//   subject?: string;
// }

// const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
//   isOpen,
//   onClose,
//   isReschedule = false,
//   rescheduleData,
//   subject
// }) => {
//   const [selectedDate, setSelectedDate] = useState('');

//   useEffect(() => {
//     if (isReschedule && rescheduleData) {
//       setSelectedDate(rescheduleData.date);
//     }
//   }, [isReschedule, rescheduleData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isReschedule && rescheduleData) {
//       // Handle rescheduling logic here
//       console.log('Rescheduled class:', { id: rescheduleData.id, date: selectedDate });
//     } else {
//       // Handle scheduling logic here
//       console.log('Requested class:', { subject, date: selectedDate });
//     }
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">
//             {isReschedule ? 'Reschedule Class' : 'Request Class'}: {subject}
//           </h2>
//           <button onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="mt-4 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
//           >
//             {isReschedule ? 'Reschedule' : 'Request'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ScheduleClassModal;