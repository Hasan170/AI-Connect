import React, { useState, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface KnowledgeBaseEntry {
  intent: string[];
  keywords: string[];
  response: string;
  followUp?: string;
}

const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    intent: ['schedule_class', 'book_class'],
    keywords: ['schedule', 'class', 'book', 'slot', 'timing', 'session'],
    response: "Let me help you schedule a class! Here's what you need to do:\n1. Head over to the calendar in your dashboard\n2. Pick a time that works for you\n3. Choose what you'd like to learn\n4. Click to confirm\n\nSuper easy! You can also set up regular sessions if you'd like.",
    followUp: "Want me to show you your upcoming schedule?"
  },
  {
    intent: ['take_notes', 'notebook'],
    keywords: ['notes', 'notebook', 'write', 'save', 'document'],
    response: "Oh, you're asking about taking notes! Our notebook is pretty cool - it's got everything you need:\n• Your work saves automatically (no more losing your notes! 😌)\n• You can write math equations easily\n• Share your notes with others\n• Keep different subjects organized\n• Access everything from anywhere\n\nI personally love the auto-save feature - it's saved me many times!",
    followUp: "Would you like some tips on organizing your notes?"
  },
  {
    intent: ['login_help', 'account_access'],
    keywords: ['login', 'account', 'password', 'forgot', 'reset', 'credentials'],
    response: "Having trouble getting in? Don't worry, I've got your back! Here's what we can do:\n1. Try logging in with your email and password\n2. If that doesn't work, click 'Forgot Password' - it happens to everyone!\n3. Still stuck? I can connect you with someone who can help\n\nJust remember, password resets go through your email for security reasons. 🔒",
    followUp: "Need help with the password reset process?"
  },
  {
    intent: ['features', 'capabilities'],
    keywords: ['feature', 'do', 'can', 'able', 'capability', 'available'],
    response: "Let me tell you what you can do here - it's pretty exciting!\n• Join live interactive sessions\n• Keep track of your progress\n• Use our smart note-taking tools\n• Connect and collaborate with others\n• Access learning materials anytime\n• Set your own learning pace\n\nThere's a lot more to explore! What interests you most?",
    followUp: "Want me to explain any of these features in detail?"
  },
  {
    intent: ['assignments', 'homework'],
    keywords: ['assignment', 'homework', 'submit', 'due', 'deadline'],
    response: "Let's talk about assignments! Here's how to stay on top of everything:\n• Find all your work in the Assignments section\n• See when things are due (no more missed deadlines! 🎉)\n• Submit your work right through the platform\n• Get notifications when it's received\n• Track your progress\n• Set reminders if you want (super helpful!)",
    followUp: "Need a hand with submitting your work?"
  },
  {
    intent: ['technical_support', 'issues'],
    keywords: ['problem', 'error', 'issue', 'bug', 'help', 'support'],
    response: "Oh no, running into some trouble? Let's get that sorted out!\n1. Check out our FAQ page - it might have a quick fix\n2. Drop our support team a message at support@ai-connect.com\n3. Hit the 'Report Issue' button in your dashboard\n4. For urgent stuff, give us a call at 1-800-AI-CONNECT\n\nWe're here to help! 🤝",
    followUp: "Want me to point you to some common solutions?"
  },
  {
    intent: ['greeting'],
    keywords: ['hi', 'hello', 'hey', 'greetings', 'good'],
    response: "Hey there! 👋 I'm Dobby, and I'm really excited to help you out! I know all about:\n• Getting your classes set up\n• Keeping your work organized\n• Making the most of our cool features\n• Fixing any issues that pop up\n\nWhat's on your mind? I'm all ears! 😊",
    followUp: "How can I make your day better?"
  }
];

const ChatSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Preprocess text by removing special characters and converting to lowercase
  const preprocessText = (text: string): string => {
    return text.toLowerCase().replace(/[^\w\s]/g, '');
  };

  // Calculate similarity score between two texts based on matching words
  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = new Set(preprocessText(text1).split(' '));
    const words2 = new Set(preprocessText(text2).split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  };

  // Find the best matching response from knowledge base
  const findBestResponse = (userMessage: string): KnowledgeBaseEntry => {
    const processedMessage = preprocessText(userMessage);
    let bestMatch: KnowledgeBaseEntry = knowledgeBase[knowledgeBase.length - 1]; // Default to greeting
    let highestScore = 0;

    knowledgeBase.forEach(entry => {
      // Check keywords match
      const keywordScore = entry.keywords.reduce((score, keyword) => {
        return score + (processedMessage.includes(keyword) ? 1 : 0);
      }, 0) / entry.keywords.length;

      // Check intent match
      const intentScore = entry.intent.reduce((score, intent) => {
        return score + calculateSimilarity(processedMessage, intent);
      }, 0) / entry.intent.length;

      // Combined score with weights
      const totalScore = (keywordScore * 0.6) + (intentScore * 0.4);

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestMatch = entry;
      }
    });

    return bestMatch;
  };

  const getBotResponse = useCallback((message: string): string => {
    const bestMatch = findBestResponse(message);
    return bestMatch.response + (bestMatch.followUp ? `\n\n${bestMatch.followUp}` : '');
  }, []);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages: Message[] = [...messages, {
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString()
    }];

    // Add bot response
    const botResponse = getBotResponse(inputMessage);
    newMessages.push({
      text: botResponse,
      sender: 'bot' as const,
      timestamp: new Date().toLocaleTimeString()
    });

    setMessages(newMessages);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Friendly Robot Chat Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 animate-bounce-gentle"
          style={{
            width: '64px',
            height: '64px'
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Bot
              size={32}
              className={`transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            {/* Animated wave hand on hover */}
            {isHovered && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-xl rounded-full w-6 h-6 flex items-center justify-center animate-wave">
                👋
              </div>
            )}
          </div>
          {/* Friendly tooltip */}
          <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            Hey! Need help? 😊
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 flex flex-col h-[600px]">
          {/* Header with robot icon */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot size={24} className="text-white" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-blue-600"></span>
              </div>
              <h3 className="font-semibold">Dobby - AI Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition-colors duration-200">
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessages([]);
                }}
                className="hover:bg-blue-700 p-1 rounded transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                <div className="flex justify-center mb-4">
                  <Bot size={48} className="text-blue-600" />
                </div>
                <p>👋 Hi! I'm Dobby, your AI-Connect assistant.</p>
                <p className="text-sm mt-2">I can help you with:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Scheduling and attending classes</li>
                  <li>• Taking and organizing notes</li>
                  <li>• Managing assignments</li>
                  <li>• Technical support</li>
                  <li>• And much more!</li>
                </ul>
                <p className="text-sm mt-4">How can I assist you today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-75 block mt-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add these styles to your CSS/Tailwind config
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes bounce-gentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
  }
  .animate-bounce-gentle {
    animation: bounce-gentle 2s infinite;
  }
  .animate-wave {
    animation: wave 0.5s infinite;
  }
`;
document.head.appendChild(styleTag);

export default ChatSupportWidget;

