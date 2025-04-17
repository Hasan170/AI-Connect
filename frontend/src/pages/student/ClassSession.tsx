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
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [forceClosed, setForceClosed] = useState(false);

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if ((window as any).jitsiApi) {
    e.preventDefault();
    e.returnValue = '';
    handleEndClass();
  }
};

useEffect(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);

// Update your useEffect hook
useEffect(() => {
  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching class details for:', classId); // Debug log
      
      const res = await api.get(`/classes/${classId}`);
      console.log('API Response:', res.data); // Debug log

      if (!res.data.success || !res.data.data?.meetingId) {
        throw new Error(res.data.message || 'Invalid class configuration');
      }

      setMeetingId(res.data.data.meetingId);
      console.log('Meeting ID set:', res.data.data.meetingId); // Debug log

    } catch (error: any) {
      console.error('Full error:', error); // Detailed log
      setError(error.message);
      setTimeout(() => navigate('/student-profile'), 3000); // Fallback redirect
    } finally {
      setLoading(false);
    }
  };

  // Add abort controller to prevent memory leaks
  const abortController = new AbortController();
  fetchMeetingDetails();

  return () => abortController.abort();
}, [classId, navigate]);

  useEffect(() => {
    return () => {
      if ((window as any).jitsiApi) {
        try {
          (window as any).jitsiApi.dispose();
        } catch (e) {
          console.error('Dispose error:', e);
        }
        delete (window as any).jitsiApi;
      }
    };
  }, []);
  

  // const handleEndClass = async () => {
  //   try {
  //     if (forceClosed || !meetingStarted) return;
  //     setForceClosed(true);
  
  //     // 1. Immediately remove Jitsi iframe
  //     const jitsiContainer = document.querySelector('[id^="jitsiConference"]');
  //     if (jitsiContainer) {
  //       jitsiContainer.remove();
  //     }
  
  //     // 2. Force cleanup Jitsi API
  //     if ((window as any).jitsiApi) {
  //       try {
  //         (window as any).jitsiApi.dispose();
  //       } catch (e) {
  //         console.error('Jitsi dispose error:', e);
  //       }
  //       delete (window as any).jitsiApi;
  //     }
  
  //     // 3. Immediate redirect before any API calls
  //     const role = localStorage.getItem('userRole');
  //     navigate(role === 'student' ? '/student-profile' : '/tutor-profile', {
  //       replace: true
  //     });
  
  //     // 4. Send completion request in background
  //     try {
  //       await api.patch(`/classes/${classId}/complete`);
  //     } catch (error) {
  //       console.error('Completion error:', error);
  //       // Implement retry logic here if needed
  //     }
  
  //     // 5. Force DOM cleanup
  //     const jitsiElements = document.querySelectorAll(
  //       '.jitsi-iframe-container, .jitsi-promotional'
  //     );
  //     jitsiElements.forEach(el => el.remove());

  //     const iframe = document.querySelector('iframe');
  //     if (iframe && iframe.src.includes('jitsi')) {
  //       iframe.remove(); // or iframe.parentNode?.removeChild(iframe);
  //     }
  
  //   } catch (error) {
  //     console.error('End class error:', error);
  //     navigate('/error', { replace: true });
  //   }
  // };

  const handleEndClass = async () => {
    try {
      if (forceClosed) return;
      setForceClosed(true);
  
      // Nuclear cleanup of Jitsi elements
      const jitsiElements = document.querySelectorAll(
        '[id^="jitsi"], [class*="jitsi"], [data-testid*="jitsi"], iframe'
      );
      
      jitsiElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
  
      // Force dispose API
      if ((window as any).jitsiApi) {
        try {
          (window as any).jitsiApi.dispose();
          delete (window as any).jitsiApi;
        } catch (e) {
          console.error('Jitsi dispose error:', e);
        }
      }
  
      // Redirect using role-based logic
      const role = localStorage.getItem('userRole');
      navigate(role === 'student' ? '/student-profile' : '/tutor-profile', {
        replace: true,
        state: { fromClass: true }
      });
  
      // Remove any residual event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Send completion request
      try {
        await api.patch(`/classes/${classId}/complete`);
      } catch (error) {
        console.error('Completion error:', error);
      }
    } catch (error) {
      console.error('End class error:', error);
      navigate('/error', { replace: true });
    }
  };

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
    <div className="fixed inset-0 z-[9999] bg-white" style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
    {/* <div className="h-[calc(100vh-80px)] mt-16 w-full"> */}
    <JitsiMeeting
      roomName={meetingId}
      configOverwrite={{
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableThirdPartyRequests: true,
        enableWelcomePage: false,
        enableClosePage: false,
        prejoinPageEnabled: false,
        disableBeforeUnloadHandlers: true,
        disableProfile: false,
        requireDisplayName: true,
        disableShowMoreStats: true,
        enableNoisyMicDetection: false,
        disableSelfViewSettings: true,
        enableCalendarIntegration: false,
        hideConferenceTimer: false,
        hideConferenceSubject: true,
        disableFilmstripAutohiding: true,
        disableRemoteMute: true,
        enableFeaturesBasedOnToken: false,
        hideLobbyButton: true,

        toolbarConfig: {
          autoHideWhileChatIsOpen: true,
          initialTimeout: 3000,
          timeout: 5000,
          alwaysVisible: false
        },

        interfaceConfigOverwrite: {
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          SHOW_MEETING_HASH: false,
          DISABLE_PRESENCE_STATUS: true,
          DISABLE_VIDEO_BACKGROUND: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_END_MEETING_NOTIFICATION: true,
          SHOW_END_MEETING_HOURS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'hangup', 'chat', 'settings', 'raisehand', 'tileview'
          ],
          CONNECTION_INDICATOR_DISABLED: true,
          VIDEO_QUALITY_LABEL_DISABLED: true,
          DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
          HIDE_KICK_BUTTON: true,
          HIDE_INVITE_FUNCTIONALITY: true,
          CLOSE_PAGE_GUEST_HINT: false,
          RANDOM_MEETING_HINT: false,
          HIDE_DEEP_LINKING_LOGO: true,
          DISABLE_RINGING: true,
          DISABLE_TRANSCRIPTION_SUBTITLES: true,
          DISABLE_VISITORS_CHAT: true,
          RECENT_LIST_ENABLED: false
        }
      }}
      // onApiReady={(api) => {
      //   console.log('Jitsi API Ready');
      //   (window as any).jitsiApi = api;

      //   // Override Jitsi's hangup handler
      //   api.addEventListener('readyToClose', () => {
      //     console.log('Jitsi readyToClose triggered');
      //     handleEndClass();
      //     return Promise.resolve(); // Prevent Jitsi from showing any UI
      //   });

      //   api.addEventListener('videoConferenceLeft', () => {
      //     console.log('Conference left');
      //     handleEndClass();
      //   });
        
      //   // Set display name immediately
      //   api.executeCommand(
      //     'displayName',
      //     localStorage.getItem('studentName') || 
      //     localStorage.getItem('teacherName') || 
      //     'Participant'
      //   );

      //   // // Block all post-meeting screens
      //   // api.executeCommand('toggleShareScreen', false);
      //   // api.executeCommand('toggleChat', false);
      //   // api.executeCommand('subject', 'private-class');

      //   // Single meeting end handler
      //   const handleMeetingEnd = () => {
      //     console.log('Meeting end triggered');
      //     if (!meetingStarted) return;
      //     handleEndClass();
      //   };
        
      //   // Conference joined handler
      //   api.addEventListener('videoConferenceJoined', () => {
      //     console.log('Meeting started');
      //     setMeetingStarted(true);
          
      //     // Setup hangup handler only after meeting starts
      //     api.addEventListener('hangup', handleMeetingEnd);
      //   });

      //   // Setup leave handler
      //   api.addEventListener('videoConferenceLeft', handleMeetingEnd);

      //   // Block Jitsi's post-meeting screen
      //   api.addEventListener('readyToClose', () => {
      //     console.log('Blocking Jitsi close screen');
      //     handleMeetingEnd();

      //     api.dispose(); 
      //     delete (window as any).jitsiApi;
      //   });
        
      //   // Force hide any promotional elements
      //   setTimeout(() => {
      //     const jitsiElements = document.querySelectorAll(
      //       '[aria-label*="Jitsi"], [data-testid*="watermark"], .jitsi-promotional'
      //     );
      //     jitsiElements.forEach(el => el.remove());
      //   }, 1000);
      // }}
      onApiReady={(api) => {
        console.log('Jitsi API Ready');
        (window as any).jitsiApi = api;
      
        // Set display name first
        api.executeCommand(
          'displayName',
          localStorage.getItem('studentName') || 
          localStorage.getItem('teacherName') || 
          'Participant'
        );
      
        // Single conference joined handler
        api.addEventListener('videoConferenceJoined', () => {
          console.log('Meeting started');
          setMeetingStarted(true);
          
          // Add hangup handler only after joining
          api.addEventListener('hangup', () => {
            console.log('User initiated hangup');
            handleEndClass();
          });
        });
      
        // Conference left handler (for unexpected disconnects)
        api.addEventListener('videoConferenceLeft', () => {
          console.log('Conference left event');
          if (meetingStarted) handleEndClass();
        });
      
        // Ready to close handler (Jitsi's internal close event)
        api.addEventListener('readyToClose', () => {
          console.log('Jitsi readyToClose');
          if (meetingStarted) {
            handleEndClass();
            return Promise.resolve(); // Block Jitsi's UI
          }
          return Promise.reject(); // Prevent closing during setup
        });
      }}
      onReadyToClose={() => {
        console.log('Custom close handler triggered');
        handleEndClass();
        return Promise.resolve(); // Critical for preventing Jitsi UI

        // const iframe = document.querySelector('iframe');
        // if (iframe && iframe.src.includes('jitsi')) {
        //   iframe.remove();
        // }
        
        // handleEndClass();

        // // 💡 Just in case, clean up manually
        // if ((window as any).jitsiApi) {
        //   (window as any).jitsiApi.dispose();
        //   delete (window as any).jitsiApi;
        // }

        // return false; // Prevent Jitsi's default close behavior
      }}
      getIFrameRef={(iframe) => {
        iframe.style.height = 'calc(100vh - 80px)';
        iframe.style.width = '100%';
        iframe.style.position = 'fixed';
        iframe.style.top = '80px';
        iframe.style.left = '0';
      }}
      userInfo={{
        displayName: localStorage.getItem('studentName') || 
                    localStorage.getItem('teacherName') ||
                    'Participant',
        email: localStorage.getItem('studentEmail') || 
               localStorage.getItem('teacherEmail') || ''
      }}
    />
    </div>
  );
};

export default ClassSession;