import React, { useState } from 'react';
import { X, UserPlus, DollarSign, CheckSquare, ArrowRight } from 'lucide-react';
import Button from './Button';

interface QuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickCapture: React.FC<QuickCaptureProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'lead' | 'deal' | 'task'>('deal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would dispatch an action
    alert(`Captured new ${activeTab}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 ring-1 ring-black/5">
        
        {/* Header with Tabs */}
        <div className="bg-slate-50/50 border-b border-slate-200 flex justify-between items-center px-5 py-4">
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('lead')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'lead' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <UserPlus className="h-3.5 w-3.5" /> Lead
                </button>
                <button 
                    onClick={() => setActiveTab('deal')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'deal' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <DollarSign className="h-3.5 w-3.5" /> Deal
                </button>
                <button 
                    onClick={() => setActiveTab('task')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'task' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <CheckSquare className="h-3.5 w-3.5" /> Task
                </button>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                <X className="h-5 w-5" />
            </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {activeTab === 'lead' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Name</label>
                        <input type="text" autoFocus className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="e.g. Jane Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="e.g. Acme Corp" />
                    </div>
                </>
            )}

            {activeTab === 'deal' && (
                <>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deal Title</label>
                        <input type="text" autoFocus className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="e.g. Website Redesign" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Value</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                                <input type="number" className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stage</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none">
                                    <option>Qualify</option>
                                    <option>Quote</option>
                                    <option>Negotiate</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'task' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action Item</label>
                        <input type="text" autoFocus className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" placeholder="e.g. Follow up with Mike" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                        <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" />
                    </div>
                </>
            )}

            <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                    Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCapture;