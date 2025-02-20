import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video, Mic, MicOff, VideoOff, MessageCircle, X, Send, Maximize, Minimize,
  Share, Users, Hand, Circle, Square, Type, Download, Phone, Circle as RecordIcon
} from 'lucide-react';

const Classroom = () => {
  const navigate = useNavigate();

  // State management
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [messages, setMessages] = useState<{ text: string; sender: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isWhiteboardFullscreen, setIsWhiteboardFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('black');

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Dummy participants data
  const [participants] = useState([
    { id: 1, name: 'Dr. Smith (Teacher)', isTeacher: true },
    { id: 2, name: 'John Doe', isTeacher: false },
  ]);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, []);

  // Drawing functions
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Message handling
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, {
      text: newMessage,
      sender: 'You',
      time: new Date().toLocaleTimeString()
    }]);
    setNewMessage('');
  };

  // Handle end class button click
  const handleEndClass = () => {
    navigate('/student-profile');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-navbar text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Mathematics Class</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Dr. Smith</span>
          <div className="flex items-center gap-2 text-sm">
            <Circle size={8} className="fill-green-400 text-green-400" />
            Connected
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">01:23:45</span>
          {isRecording && (
            <span className="flex items-center gap-2 text-red-400">
              <Circle size={8} className="fill-red-400" /> Recording
            </span>
          )}
          <button
            onClick={handleEndClass}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Phone size={16} /> End Class
          </button>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[60px]"></div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Video Grid */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[30vh]">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-gray-800 rounded-lg relative">
                <video className="w-full h-full object-cover rounded-lg" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2 rounded-full ${isVideoOn ? 'bg-navbar' : 'bg-red-500'} text-white`}
                  >
                    {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`p-2 rounded-full ${isAudioOn ? 'bg-navbar' : 'bg-red-500'} text-white`}
                  >
                    {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`p-2 rounded-full ${isHandRaised ? 'bg-yellow-500' : 'bg-gray-600'} text-white`}
                  >
                    <Hand size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg">
                <video className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>

          {/* Whiteboard */}
          <div className="bg-white rounded-lg shadow-md p-4 flex-1 relative overflow-hidden">
            {/* Whiteboard Tools */}
            <div className="absolute left-4 top-4 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-2">
              <button
                onClick={() => setSelectedTool('pen')}
                className={`p-2 rounded ${selectedTool === 'pen' ? 'bg-navbar text-white' : 'hover:bg-gray-100'}`}
              >
                <Circle size={20} />
              </button>
              <button
                onClick={() => setSelectedTool('square')}
                className={`p-2 rounded ${selectedTool === 'square' ? 'bg-navbar text-white' : 'hover:bg-gray-100'}`}
              >
                <Square size={20} />
              </button>
              <button
                onClick={() => setSelectedTool('text')}
                className={`p-2 rounded ${selectedTool === 'text' ? 'bg-navbar text-white' : 'hover:bg-gray-100'}`}
              >
                <Type size={20} />
              </button>
              <div className="h-px bg-gray-200 my-2" />
              <button
                className="w-6 h-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: currentColor }}
              />
            </div>

            {/* Whiteboard Actions */}
            <div className="absolute right-4 top-4 flex gap-2">
              <button className="p-2 bg-navbar text-white rounded hover:bg-opacity-90">
                <Share size={20} />
              </button>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded ${isRecording ? 'bg-red-500' : 'bg-navbar'} text-white`}
              >
                <RecordIcon size={20} />
              </button>
              <button className="p-2 bg-navbar text-white rounded hover:bg-opacity-90">
                <Download size={20} />
              </button>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              className="w-full h-full border rounded-lg bg-white cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>

        {/* Participants & Chat Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col overflow-hidden">
          {/* Participants Tab */}
          <div className="border-b">
            <button
              onClick={() => setIsChatOpen(false)}
              className={`w-full p-3 flex items-center gap-2 ${!isChatOpen ? 'bg-gray-100' : ''}`}
            >
              <Users size={20} />
              <span>Participants ({participants.length})</span>
            </button>
          </div>

          {!isChatOpen ? (
            <div className="flex-1 overflow-y-auto p-4">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-navbar text-white flex items-center justify-center">
                    {participant.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {participant.name}
                      {participant.isTeacher && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Teacher
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="bg-gray-100 p-2 rounded-lg">{message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-navbar text-white rounded-lg hover:bg-opacity-90"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Chat Tab */}
          <div className="border-t">
            <button
              onClick={() => setIsChatOpen(true)}
              className={`w-full p-3 flex items-center gap-2 ${isChatOpen ? 'bg-gray-100' : ''}`}
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;