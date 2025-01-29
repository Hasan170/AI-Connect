import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const Notebook = ({ onClose }) => {
  const [tabs, setTabs] = useState([{ id: 1, title: 'Class 1', content: '' }]);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const newTab = { id: tabs.length + 1, title: `Class ${tabs.length + 1}`, content: '' };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const updateTabContent = (id, content) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, content } : tab));
  };

  return (
    <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Notebook</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex items-center border-b p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 ${activeTab === tab.id ? 'bg-gray-200' : 'bg-white'} border-r`}
            >
              {tab.title}
            </button>
          ))}
          <button onClick={addTab} className="px-4 py-2 bg-white">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {tabs.map(tab => (
            tab.id === activeTab && (
              <textarea
                key={tab.id}
                value={tab.content}
                onChange={(e) => updateTabContent(tab.id, e.target.value)}
                className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                placeholder="Take your notes here..."
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notebook;