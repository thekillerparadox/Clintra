import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, User, DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIENTS, MOCK_DEALS } from '../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
        setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation logic would go here in a full implementation
  // For now, we focus on the visual and filtering logic

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredDeals = MOCK_DEALS.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden relative animate-enter ring-1 ring-black/5">
        <div className="flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm h-6"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-1">
             <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 rounded border border-slate-200">
                <span className="text-xs">Esc</span>
             </kbd>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
            {query === '' && (
                <div className="px-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Quick Actions</div>
                    <button onClick={() => handleSelect('/pipeline')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg mx-1">
                        <DollarSign className="h-4 w-4 text-slate-400" /> Go to Pipeline
                    </button>
                    <button onClick={() => handleSelect('/contacts')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg mx-1">
                        <User className="h-4 w-4 text-slate-400" /> Go to Contacts
                    </button>
                    <button onClick={() => handleSelect('/tasks')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg mx-1">
                        <FileText className="h-4 w-4 text-slate-400" /> Go to Tasks
                    </button>
                </div>
            )}

            {filteredClients.length > 0 && query !== '' && (
                <div className="px-2 mb-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Contacts</div>
                    {filteredClients.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => handleSelect(`/contacts/${c.id}`)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg mx-1 group"
                        >
                            <span className="flex items-center gap-3">
                                <img src={c.avatar} className="h-5 w-5 rounded-full" alt="" />
                                {c.name}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            )}

            {filteredDeals.length > 0 && query !== '' && (
                <div className="px-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Deals</div>
                    {filteredDeals.map(d => (
                        <button 
                            key={d.id} 
                            onClick={() => handleSelect(`/pipeline`)} // In a real app, opens deal modal
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg mx-1 group"
                        >
                            <span className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                                {d.title}
                            </span>
                            <span className="text-xs text-slate-400">${d.value.toLocaleString()}</span>
                        </button>
                    ))}
                </div>
            )}
            
            {query !== '' && filteredClients.length === 0 && filteredDeals.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                    No results found for "{query}"
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400">
            <span>Clientra Global Search</span>
            <div className="flex gap-2">
                <span>Select <span className="font-bold text-slate-500">↵</span></span>
                <span>Navigate <span className="font-bold text-slate-500">↑↓</span></span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;