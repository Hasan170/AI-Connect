import { useState, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { HfInference } from '@huggingface/inference';

// Debug log for mounting
console.log('Loading AIChatWidget...');
console.log('API Key:', import.meta.env.VITE_REACT_APP_HF_API_KEY ? 'Present' : 'Missing');

const hf = new HfInference(import.meta.env.VITE_REACT_APP_HF_API_KEY);

interface Message {
  content: string;
  isUser: boolean;
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log('AIChatWidget mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { content: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        inputs: `[INST] You are an academic assistant. Answer this: ${input} [/INST]`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
        }
      });

      // Clean up the response text by removing the instruction wrapper
      const cleanedResponse = response.generated_text
        .replace(/^\[INST\].*\[\/INST\]/, '')  // Remove the instruction wrapper
        .trim();  // Remove any leading/trailing whitespace

      setMessages(prev => [...prev, {
        content: cleanedResponse,
        isUser: false
      }]);
    } catch (error: any) {
      let errorMessage = 'Dobby needs a moment to think... Please try again shortly.';
     
      if (error.response?.data?.error?.includes('rate limit')) {
        errorMessage = 'Dobby is helping others right now. Please try again in a few moments.';
      } else if (error.message?.includes('model is loading')) {
        errorMessage = `Dobby is waking up! Ready in ${Math.ceil(error.estimated_time)} seconds...`;
      }

      setMessages(prev => [...prev, {
        content: errorMessage,
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4" style={{ zIndex: 99999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-navbar hover:bg-navbar-dark text-white rounded-full p-4 shadow-lg transition-all duration-300 animate-bounce-gentle"
          style={{ width: '64px', height: '64px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Bot
              size={32}
              className={`transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            {isHovered && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-xl rounded-full w-6 h-6 flex items-center justify-center animate-wave">
                🤖
              </div>
            )}
          </div>
          <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-navbar px-3 py-1 rounded-full text-sm font-medium shadow-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            Ask AI Tutor
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 flex flex-col h-[500px]">
          <div className="bg-navbar text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot size={24} className="text-white" />
              <h3 className="font-semibold">AI Tutor</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-navbar-dark p-1 rounded transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] ${
                  msg.isUser
                    ? 'ml-auto bg-navbar text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 italic">AI is thinking...</div>
            )}
          </div>

          <div className="border-t p-4 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your academic question..."
              disabled={isLoading}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-navbar text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;