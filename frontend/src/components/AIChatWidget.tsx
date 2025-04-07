import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Bot, X, Send, Link as LinkIcon, Upload, FileText, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { useEffect as useEffectLayout } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// MathJax TypeScript declarations
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<any>;
      tex?: any;
      svg?: any;
      options?: any;
    };
  }
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// Set PDF.js worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Message {
  content: string;
  isUser: boolean;
  sources?: string[];  // Add sources field
}

interface DocumentContext {
  fileName: string;
  content: string;
  size: number;
}

// Function to load MathJax script
const loadMathJax = () => {
  if (window.MathJax) {
    // If MathJax is already loaded, configure it
    window.MathJax.typesetPromise?.();
    return;
  }

  // Create a script element for MathJax
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.async = true;
  script.id = 'MathJax-script';
 
  // Set MathJax configuration
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true
    },
    svg: {
      fontCache: 'global'
    },
    options: {
      enableMenu: false,
      renderActions: {
        addMenu: []
      }
    }
  };
 
  document.head.appendChild(script);
};

// Function to render math in an element
const renderMath = () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    try {
      window.MathJax.typesetPromise();
    } catch (error) {
      console.error('MathJax typesetting error:', error);
    }
  }
};

// Function to extract text from a file
const extractTextFromFile = async (file: File): Promise<string> => {
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
 
  // Handle plain text files
  if (['.txt', '.md', '.csv', '.json', '.html', '.xml', '.js', '.ts', '.jsx', '.tsx', '.css', '.scss'].includes(fileExtension)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
     
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to extract text from file'));
        }
      };
     
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
     
      reader.readAsText(file);
    });
  }
 
  // Handle PDF files
  if (fileExtension === '.pdf') {
    try {
      // Create array buffer from file
      const arrayBuffer = await file.arrayBuffer();
     
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
     
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
     
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF file');
    }
  }
 
  // Handle DOC/DOCX files with JSZip for better extraction
  if (['.doc', '.docx'].includes(fileExtension)) {
    try {
      const arrayBuffer = await file.arrayBuffer();
     
      // For DOCX files (which are ZIP archives with XML inside)
      if (fileExtension === '.docx') {
        try {
          const zip = new JSZip();
          const zipContent = await zip.loadAsync(arrayBuffer);
         
          // Try to get the main document content
          const contentXml = await zipContent.file('word/document.xml')?.async('text');
         
          if (contentXml) {
            // Extract text from XML tags
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contentXml, 'text/xml');
           
            // Get all text elements (w:t)
            const textNodes = xmlDoc.getElementsByTagName('w:t');
            let extractedText = '';
           
            for (let i = 0; i < textNodes.length; i++) {
              extractedText += textNodes[i].textContent + ' ';
            }
           
            // Clean up extra spaces
            extractedText = extractedText.replace(/\s+/g, ' ').trim();
           
            if (extractedText.length > 0) {
              return extractedText;
            }
          }
         
          // Fallback to basic extraction if the above fails
          const textEntries = Object.keys(zipContent.files)
            .filter(fileName => fileName.includes('word/'))
            .map(fileName => zipContent.files[fileName]);
         
          // Try to extract from any text files in the ZIP
          for (const entry of textEntries) {
            try {
              if (!entry.dir) {
                const content = await entry.async('text');
                // Look for text content
                const textMatches = content.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
                if (textMatches && textMatches.length > 0) {
                  const extractedText = textMatches
                    .map(match => match.replace(/<w:t[^>]*>|<\/w:t>/g, ''))
                    .join(' ')
                    .replace(/\s+/g, ' ');
                 
                  if (extractedText.length > 100) { // If we found reasonable content
                    return extractedText;
                  }
                }
              }
            } catch (e) {
              // Ignore errors in individual files
              console.warn('Error reading file in DOCX:', e);
            }
          }
        } catch (zipError) {
          console.error('Error processing DOCX as ZIP:', zipError);
        }
      }
     
      // Fallback for both DOC and failed DOCX extraction
      return `The content of this Word document (${fileExtension.substring(1).toUpperCase()}) couldn't be fully extracted.
      Here's what I can tell: This is a Microsoft Office document.
      For better results when asking questions about it, please consider converting it to PDF or plain text format.`;
     
    } catch (error) {
      console.error('Error processing Word document:', error);
      throw new Error('Failed to process Word document');
    }
  }
 
  throw new Error(`Unsupported file type: ${fileExtension}`);
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docContext, setDocContext] = useState<DocumentContext | null>(null);
  const [isUsingDocument, setIsUsingDocument] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatModelRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load MathJax on component mount
  useEffect(() => {
    loadMathJax();
  }, []);

  // Render math whenever messages change
  useEffect(() => {
    renderMath();
  }, [messages]);

  useEffect(() => {
    console.log('AIChatWidget mounted');
   
    // Initialize the chat model on component mount
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
     
      // Create a chat session
      chatModelRef.current = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
     
      console.log('Chat model initialized');
    } catch (err) {
      console.error('Error initializing chat model:', err);
      setError('Failed to initialize the AI. Please refresh the page.');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
   
    const file = files[0];
   
    // Accept a wider range of file types
    const validExtensions = ['.txt', '.md', '.pdf', '.doc', '.docx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
   
    if (!validExtensions.includes(fileExtension)) {
      setError(`Unsupported file type. Please upload a text, markdown, PDF, or Word document.`);
      return;
    }
   
    try {
      setIsLoading(true);
      setError(null);
     
      // Show file processing message
      setMessages(prev => [...prev, {
        content: `Processing ${file.name}... This may take a moment for larger files.`,
        isUser: false
      }]);
     
      // Extract text from the file
      const content = await extractTextFromFile(file);
     
      if (!content || content.trim().length === 0) {
        setError('The uploaded file appears to be empty or could not be processed.');
        setIsLoading(false);
        return;
      }
     
      // Truncate content if it's too long (Gemini has limits)
      const truncatedContent = content.length > 25000
        ? content.substring(0, 25000) + "... [Document truncated due to length]"
        : content;
     
      // Store file info and content
      setDocContext({
        fileName: file.name,
        content: truncatedContent,
        size: file.size
      });
     
      setIsUsingDocument(true);
     
      // Replace the processing message with success message
      setMessages(prev => {
        const newMessages = [...prev];
        // Replace the last message if it was our processing message
        if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser) {
          newMessages[newMessages.length - 1] = {
            content: `Document uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB). I'll now provide a quick overview of the document's content.`,
            isUser: false
          };
        } else {
          // Otherwise add a new message
          newMessages.push({
            content: `Document uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB). I'll now provide a quick overview of the document's content.`,
            isUser: false
          });
        }
        return newMessages;
      });
     
      // Automatically generate a brief summary/overview of the document
      setTimeout(() => {
        handleDocumentSummary(truncatedContent, file.name);
      }, 1000);
     
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error processing file:', error);
      setError(`Failed to process the file: ${error.message}. Please try a different file.`);
      setIsLoading(false);
     
      // Remove the processing message
      setMessages(prev => {
        const newMessages = [...prev];
        // Remove the last message if it was our processing message
        if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser) {
          newMessages.pop();
        }
        return newMessages;
      });
    }
   
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate a brief summary when document is uploaded
  const handleDocumentSummary = async (documentContent: string, fileName: string) => {
    setIsLoading(true);
   
    try {
      if (!chatModelRef.current) {
        throw new Error('Chat model not initialized');
      }
     
      // Create a summary prompt
      const summaryPrompt = `
        I've uploaded a document titled "${fileName}". Please provide a brief overview of this document content.
       
        DOCUMENT CONTENT:
        ${documentContent}
       
        IMPORTANT INSTRUCTIONS:
        1. Provide a short overview (3-5 sentences) of what this document is about.
        2. Mention 2-3 key points or topics covered in the document.
        3. Keep it very concise and informative.
        4. Don't include your own opinions or analysis, just summarize the content.
       
        Your response should be direct and to the point without unnecessary preamble.
      `;
     
      // Send the request
      const result = await chatModelRef.current.sendMessage(summaryPrompt);
      const response = await result.response;
      const summaryText = response.text().trim();
     
      // Add a user message simulating the request
      setMessages(prev => [...prev, {
        content: "Can you give me a brief overview of this document?",
        isUser: true
      }]);
     
      // Add the summary
      setMessages(prev => [...prev, {
        content: summaryText,
        isUser: false,
        sources: [`Document: ${fileName}`]
      }]);
     
    } catch (error: any) {
      console.error('Error generating document summary:', error);
      // Just log the error but don't show to user since this is an automatic action
    } finally {
      setIsLoading(false);
    }
  };

  const clearDocument = () => {
    setDocContext(null);
    setIsUsingDocument(false);
   
    // Add a system message to inform the user
    setMessages(prev => [...prev, {
      content: 'Document has been removed. The AI will no longer use it for answers.',
      isUser: false
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Reset any previous errors
    setError(null);
   
    // Store input before clearing it
    const userQuestion = input.trim();
   
    // Add user message to chat
    setMessages(prev => [...prev, { content: userQuestion, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request to Gemini Chat API...');
     
      if (!chatModelRef.current) {
        throw new Error('Chat model not initialized');
      }

      // Build the prompt based on whether we're using a document or not
      let prompt = '';
     
      if (isUsingDocument && docContext) {
        // Check if the user is asking for a summary
        const isSummaryRequest = userQuestion.toLowerCase().includes('summarize') ||
                                 userQuestion.toLowerCase().includes('summary') ||
                                 userQuestion.toLowerCase().includes('summarise') ||
                                 userQuestion.toLowerCase().includes('brief overview') ||
                                 userQuestion.toLowerCase().includes('give me an overview');
       
        if (isSummaryRequest) {
          prompt = `
            I've uploaded a document titled "${docContext.fileName}". Please provide a detailed summary of this document content.
           
            DOCUMENT CONTENT:
            ${docContext.content}
           
            IMPORTANT INSTRUCTIONS:
            1. Provide a comprehensive summary of the document's main points and key information.
            2. Structure the summary with clear sections if the document covers multiple topics.
            3. Include important facts, figures, and conclusions from the document.
            4. For mathematical content, use LaTeX syntax with proper delimiters.
            5. Keep the summary concise but comprehensive.
           
            Your response MUST follow this exact format:
            1. First, provide your detailed summary with proper formatting
            2. Then add a clear separator using "---SOURCES---" on its own line
            3. After the separator, add "Document: ${docContext.fileName}" as the source
          `;
        } else {
          prompt = `
            I've uploaded a document titled "${docContext.fileName}". Please answer my question based on this document content.
           
            DOCUMENT CONTENT:
            ${docContext.content}
           
            QUESTION: ${userQuestion}
           
            IMPORTANT INSTRUCTIONS:
            1. Base your answer ONLY on the information in the document.
            2. If the answer isn't in the document, state that clearly.
            3. Include direct quotes from the document when relevant to support your answer.
            4. For mathematical content, use LaTeX syntax with proper delimiters:
               - For inline math, use $...$ (e.g., $x^2 + y^2 = z^2$)
               - For display/block math, use $$...$$ (e.g., $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$)
            5. Keep your answer comprehensive and relevant to the document.
            6. For sources, cite specific sections or paragraphs from the document.
            7. If the question asks you to generate information not in the document, clearly state that you can only work with content from the document.
           
            Your response MUST follow this exact format:
            1. First, provide your detailed answer with proper formatting
            2. Then add a clear separator using "---SOURCES---" on its own line
            3. After the separator, reference the document and specific sections used
          `;
        }
      } else {
        prompt = `
          Answer this academic question: ${userQuestion}
         
          IMPORTANT INSTRUCTIONS:
          1. For mathematical questions, show step-by-step calculations and solutions.
          2. For mathematical notation, use LaTeX syntax with proper delimiters:
             - For inline math, use $...$ (e.g., $x^2 + y^2 = z^2$)
             - For display/block math, use $$...$$ (e.g., $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$)
          3. Ensure equations are formatted clearly and always use proper LaTeX syntax.
          4. If the question involves numerical calculations, verify your calculations before providing the answer.
         
          You MUST always provide reliable sources for your answer.
         
          Your response MUST follow this exact format:
          1. First, provide your detailed answer with proper formatting for mathematical content
          2. Then add a clear separator using "---SOURCES---" on its own line
          3. After the separator, provide at least 3-5 reliable and valid source URLs, each on a new line
         
          Example format:
          [Your detailed answer with LaTeX math notation if applicable]
         
          ---SOURCES---
          https://example.com/source1
          https://example.com/source2
          https://example.com/source3
        `;
      }

      // Send the message to the chat model
      const result = await chatModelRef.current.sendMessage(prompt);
     
      console.log('Received response from Gemini Chat API');
     
      const response = await result.response;
      const fullText = response.text();
     
      console.log('Processing response text');
     
      // Split response into content and sources
      let [content, sourcesSection] = fullText.split('---SOURCES---');
     
      // Ensure content is not empty
      content = content ? content.trim() : 'I apologize, but I couldn\'t generate a proper response.';
     
      // Process sources - ensure they are valid URLs
      let sources: string[] = [];
      if (sourcesSection) {
        try {
          sources = sourcesSection.trim()
            .split('\n')
            .filter(Boolean)
            .filter((url: string) => {
              try {
                // In document mode, just use the text as sources
                if (isUsingDocument) return true;
               
                // Otherwise validate URLs
                new URL(url);
                return true;
              } catch {
                console.warn('Invalid URL found in sources:', url);
                return false;
              }
            });
        } catch (err) {
          console.error('Error processing sources:', err);
          // Continue with empty sources if there was an error
        }
      }

      console.log(`Adding AI response with ${sources.length} sources`);
     
      setMessages(prev => [...prev, {
        content: content,
        isUser: false,
        sources
      }]);
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error details:', error.message, error.stack);
     
      // If chat model failed, try to reinitialize it
      if (error.message.includes('Chat model not initialized')) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          chatModelRef.current = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 1000 }
          });
          console.log('Chat model reinitialized');
        } catch (initError) {
          console.error('Failed to reinitialize chat model:', initError);
        }
      }
     
      setError('Failed to get a response. Please try again.');
     
      setMessages(prev => [...prev, {
        content: 'Sorry, I need a moment to think. Please try again shortly.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the chat conversation
  const resetConversation = () => {
    try {
      // Clear UI messages
      setMessages([]);
      setError(null);
      setDocContext(null);
      setIsUsingDocument(false);
     
      // Reset the chat model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      chatModelRef.current = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 1000 }
      });
     
      console.log('Conversation reset');
    } catch (err) {
      console.error('Error resetting conversation:', err);
      setError('Failed to reset the conversation.');
    }
  };

  // Safe render function for source URLs
  const renderSourceURL = (url: string, index: number) => {
    if (isUsingDocument) {
      return (
        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
          <FileText size={12} />
          <span>{url}</span>
        </div>
      );
    }

    try {
      const hostname = new URL(url).hostname;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-navbar hover:underline mb-1"
        >
          <LinkIcon size={12} />
          {hostname}
        </a>
      );
    } catch (err) {
      console.warn('Error rendering source URL:', url, err);
      return (
        <span key={index} className="text-xs text-gray-400">Invalid URL</span>
      );
    }
  };

  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
   
    switch (extension) {
      case '.pdf':
        return (
          <div className="text-red-600 font-medium text-[10px] px-1 border border-red-200 rounded">
            PDF
          </div>
        );
      case '.doc':
      case '.docx':
        return (
          <div className="text-blue-600 font-medium text-[10px] px-1 border border-blue-200 rounded">
            DOC
          </div>
        );
      default:
        return (
          <div className="text-gray-600 font-medium text-[10px] px-1 border border-gray-200 rounded">
            TXT
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-20 right-4" style={{ zIndex: 99999 }}>
      <style>
        {`
          .math-content {
            overflow-x: auto;
          }
          .math-content .MathJax {
            overflow-x: auto;
            max-width: 100%;
          }
          .doc-badge {
            position: absolute;
            top: 14px;
            right: 80px;
            background-color: #f0f9ff;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .doc-info {
            background-color: #f0f9ff;
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 8px 12px;
            margin-bottom: 12px;
            font-size: 0.85rem;
          }
          .file-input-button {
            background-color: #f3f4f6;
            border: 1px dashed #d1d5db;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
          }
          .file-input-button:hover {
            background-color: #e5e7eb;
            border-color: #9ca3af;
          }
        `}
      </style>
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
        <div className="bg-white rounded-lg shadow-xl w-[420px] flex flex-col h-[550px] overflow-hidden">
          <div className="bg-navbar text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot size={24} className="text-white" />
              <h3 className="font-semibold">AI Tutor</h3>
            </div>
           
            {isUsingDocument && (
              <div className="doc-badge">
                <FileText size={12} />
                <span>Document Mode</span>
              </div>
            )}
           
            <div className="flex items-center">
              {messages.length > 0 && (
                <button
                  onClick={resetConversation}
                  className="text-xs text-white/80 hover:text-white mr-3 px-2 py-1 hover:bg-navbar-dark rounded transition-colors"
                  title="Reset Conversation"
                >
                  Reset Chat
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-navbar-dark p-1 rounded transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-gray-400 text-center py-6">
                <p className="mb-2">Ask me any academic questions!</p>
                <p className="text-xs mb-6">I remember our conversation, so you can ask follow-up questions.</p>
               
                <p className="text-sm font-medium text-gray-600 mb-2">Or upload a document to ask questions about it:</p>
                <label className="file-input-button mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.pdf,.doc,.docx"
                    className="sr-only"
                  />
                  <Upload size={16} className="text-gray-500" />
                  <span className="text-sm">Upload a document</span>
                </label>
                <p className="text-xs text-gray-400">Supported formats: .txt, .md, .pdf, .doc, .docx</p>
              </div>
            )}
           
            {docContext && isUsingDocument && (
              <div className="doc-info flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-blue-600" />
                    <span className="font-medium text-gray-800 text-sm">{docContext.fileName}</span>
                    {getFileIcon(docContext.fileName)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(docContext.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  onClick={clearDocument}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  title="Remove document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
           
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] ${
                  msg.isUser
                    ? 'ml-auto bg-navbar text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.isUser ? (
                  <div className="break-words">{msg.content}</div>
                ) : (
                  <div
                    className="break-words math-content"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  ></div>
                )}
                {!msg.isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 font-medium mb-1">
                      {isUsingDocument ? 'References:' : 'Sources:'}
                    </div>
                    {msg.sources.map((source, index) => renderSourceURL(source, index))}
                  </div>
                )}
              </div>
            ))}
           
            {isLoading && (
              <div className="bg-gray-100 p-3 rounded-lg max-w-[85%] flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                <span className="text-gray-500 ml-1">AI is thinking...</span>
              </div>
            )}
           
            {error && (
              <div className="text-red-500 bg-red-50 p-2 rounded text-sm">
                {error}
              </div>
            )}
           
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-white flex gap-2">
            {messages.length > 0 && !docContext && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload document"
              >
                <Upload size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf,.doc,.docx"
                  className="sr-only"
                />
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isUsingDocument
                ? "Ask a question about the document..."
                : "Ask your academic question..."}
              disabled={isLoading}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar"
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit(e)}
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

