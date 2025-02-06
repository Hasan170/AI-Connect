import React, { useState } from 'react';
import { Users, BookOpen, DollarSign, Activity, Check, X } from 'lucide-react';
import Sidebar from '../components/AdminSidebar';

interface ClassRequest {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <Users className="w-6 h-6" />, change: '+12%', bgColor: 'bg-blue-50' },
    { title: 'Active Classes', value: '156', icon: <BookOpen className="w-6 h-6" />, change: '+8%', bgColor: 'bg-green-50' },
    { title: 'Revenue', value: '$12,345', icon: <DollarSign className="w-6 h-6" />, change: '+15%', bgColor: 'bg-yellow-50' },
    { title: 'User Growth', value: '23%', icon: <Activity className="w-6 h-6" />, change: '+5%', bgColor: 'bg-purple-50' },
  ];

  const [studentRequests, setStudentRequests] = useState<ClassRequest[]>([
    { id: '1', name: 'John Doe', subject: 'Math', date: '2024-01-20', time: '10:00', status: 'pending' },
  ]);
  const [tutorRequests, setTutorRequests] = useState<ClassRequest[]>([
    { id: '2', name: 'Jane Smith', subject: 'English', date: '2024-02-10', time: '14:00', status: 'pending' },
  ]);

  const [scheduledClasses, setScheduledClasses] = useState<ClassRequest[]>([]);

  const approveStudent = (id: string) => {
    setStudentRequests((prev) => {
      const updated = prev.map((req): ClassRequest =>
        req.id === id ? { ...req, status: 'approved' } : req
      );
      const approvedRequest = updated.find((req) => req.id === id);
      if (approvedRequest && !scheduledClasses.some((sc) => sc.id === approvedRequest.id)) {
        setScheduledClasses((prevSched) => [...prevSched, approvedRequest]);
      }
      return updated.filter((req) => req.id !== id);
    });
  };

  const rejectStudent = (id: string) => {
    setStudentRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const approveTutor = (id: string) => {
    setTutorRequests((prev) => {
      const updated = prev.map((req): ClassRequest =>
        req.id === id ? { ...req, status: 'approved' } : req
      );
      const approvedRequest = updated.find((req) => req.id === id);
      if (approvedRequest && !scheduledClasses.some((sc) => sc.id === approvedRequest.id)) {
        setScheduledClasses((prevSched) => [...prevSched, approvedRequest]);
      }
      return updated.filter((req) => req.id !== id);
    });
  };

  const rejectTutor = (id: string) => {
    setTutorRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-text-secondary mt-2">Manage your platform and users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} p-6 rounded-lg shadow-md hover:scale-105 transition-transform`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className="text-navbar">{stat.icon}</div>
                </div>
                <p className="text-green-600 text-sm mt-2">{stat.change} this month</p>
              </div>
            ))}
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Requests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Student Class Requests</h2>
              {studentRequests.length === 0 ? (
                <p className="text-gray-500">No class requests</p>
              ) : (
                <div className="space-y-4">
                  {studentRequests.map((req) => (
                    <div key={req.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-gray-500">{req.subject}</p>
                        <p className="text-gray-500">{req.date} at {req.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-green-600 hover:text-green-800" onClick={() => approveStudent(req.id)}>
                          <Check size={20} />
                        </button>
                        <button className="text-red-600 hover:text-red-800" onClick={() => rejectStudent(req.id)}>
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tutor Requests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Tutor Class Requests</h2>
              {tutorRequests.length === 0 ? (
                <p className="text-gray-500">No class requests</p>
              ) : (
                <div className="space-y-4">
                  {tutorRequests.map((req) => (
                    <div key={req.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-gray-500">{req.subject}</p>
                        <p className="text-gray-500">{req.date} at {req.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-green-600 hover:text-green-800" onClick={() => approveTutor(req.id)}>
                          <Check size={20} />
                        </button>
                        <button className="text-red-600 hover:text-red-800" onClick={() => rejectTutor(req.id)}>
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scheduled Classes */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Scheduled Classes</h2>
            {scheduledClasses.length === 0 ? (
              <p className="text-gray-500">No scheduled classes</p>
            ) : (
              <div className="space-y-4">
                {scheduledClasses.map((sc) => (
                  <div key={sc.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{sc.name}</p>
                    <p className="text-gray-500">{sc.subject}</p>
                    <p className="text-gray-500">{sc.date} at {sc.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}