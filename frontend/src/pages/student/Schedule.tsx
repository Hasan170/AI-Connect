import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';
import { Link } from 'react-router-dom';
import { User, Clock, Book, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface ClassSession {
  id: string;
  subject: string;
  teacherName: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  topic: string;
}

const Schedule = () => {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const classes: ClassSession[] = [
    {
      id: '1',
      subject: 'Mathematics',
      teacherName: 'Dr. Smith',
      date: '2025-02-01',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'cancelled',
      topic: 'Advanced Calculus'
    },
    {
      id: '2',
      subject: 'Physics',
      teacherName: 'Prof. Johnson',
      date: '2025-02-02',
      time: '2:00 PM',
      duration: '1 hour',
      status: 'completed',
      topic: 'Quantum Mechanics'
    },
    {
      id: '3',
      subject: 'Chemistry',
      teacherName: 'Dr. Williams',
      date: '2025-02-03',
      time: '11:00 AM',
      duration: '1 hour',
      status: 'upcoming',
      topic: 'Organic Chemistry'
    }
  ];

  const getClassDetails = (date: Date) => {
    return classes.filter(
      (classItem) => new Date(classItem.date).toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classDetails = getClassDetails(date);
      if (classDetails.length > 0) {
        return (
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-navbar"></div>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <h1 className="text-3xl font-bold text-text-primary">Class Schedule</h1>
            <p className="text-text-secondary mt-2">View and manage your upcoming classes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
                <Calendar
                  onChange={(date: Date) => {
                    setValue(date);
                    setSelectedDate(date);
                  }}
                  value={value}
                  tileContent={tileContent}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.01] transition-all duration-300">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  {selectedDate ? selectedDate.toDateString() : "Select a date"}
                </h2>
                <div className="space-y-4">
                  {selectedDate && getClassDetails(selectedDate).map((classItem) => (
                    <div
                      key={classItem.id}
                      className="p-4 bg-background rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-text-primary">{classItem.subject}</h3>
                          <p className="text-sm text-text-secondary">{classItem.topic}</p>
                        </div>
                        <span className={`flex items-center gap-1 text-sm ${getStatusColor(classItem.status)}`}>
                          {getStatusIcon(classItem.status)}
                          {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                        <User size={16} />
                        <span>{classItem.teacherName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock size={16} />
                        <span>{classItem.time} ({classItem.duration})</span>
                      </div>
                      {classItem.status === 'upcoming' && (
                        <Link
                          to="/student/classroom"
                          className="mt-3 flex items-center gap-2 text-sm text-white bg-navbar px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                        >
                          <Book size={16} />
                          Join Class
                        </Link>
                      )}
                    </div>
                  ))}
                  {selectedDate && getClassDetails(selectedDate).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No classes scheduled for this date</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;