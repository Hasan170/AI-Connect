import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

interface NotebookProps {
  onClose: () => void;
}

const Notebook = ({ onClose }: NotebookProps) => {
  const [tabs, setTabs] = useState([{ 
    id: 1, 
    title: 'Class 1', 
    content: '<p>Start taking notes...</p>' 
  }]);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const newTab = { 
      id: tabs.length + 1, 
      title: `Class ${tabs.length + 1}`, 
      content: '<p>New notes...</p>' 
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const updateTabContent = (id: number, content: string) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, content } : tab));
  };

  return (
    <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Smart Notebook</h2>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b p-2 bg-gray-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm ${
              activeTab === tab.id 
                ? 'bg-white border-t border-l border-r text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.title}
          </button>
        ))}
        <button 
          onClick={addTab}
          className="ml-2 p-2 hover:bg-gray-200 rounded"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        {tabs.map(tab => (
          tab.id === activeTab && (
            <TipTapEditor
              key={tab.id}
              content={tab.content}
              onUpdate={(content) => updateTabContent(tab.id, content)}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Notebook;