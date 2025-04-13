// frontend/src/pages/student/ClassSession.tsx
import { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const ClassSession = () => {
  const { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate();

useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/classes/${classId}`);
        
        if (!res.data.success) {
          throw new Error(res.data.message || 'Failed to load class');
        }
  
        if (!res.data.data?.meetingId) {
          throw new Error('Class session not properly configured');
        }
  
        setMeetingId(res.data.data.meetingId);
        
      } catch (error: unknown) {
        console.error('Error:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
          setError(axiosError.response?.data?.message || 'An error occurred');
          // Only navigate if it's a fatal error
          if (axiosError.response?.status === 404 || axiosError.response?.status === 400) {
            navigate('/student-profile');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetingDetails();
  }, [classId, navigate]);

  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="ml-3">Loading classroom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error joining class</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-navbar text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <JitsiMeeting
        roomName={meetingId}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: false
        }}
        getIFrameRef={(iframe) => {
          iframe.style.height = '100vh';
          iframe.style.width = '100%';
        }}
      />
    </div>
  );
};

export default ClassSession;