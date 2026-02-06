import React, { useState, useMemo, useEffect } from 'react';
import { X, TrendingUp, Calendar, BrainCircuit, Loader2, CheckCircle2, ArrowRight, User, Mail, Phone, FileText, AlertTriangle, Building2, MapPin } from 'lucide-react';
import { Deal, Client } from '../types';
import { MOCK_CLIENTS, MOCK_ACTIVITIES, MOCK_TASKS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { analyzeDealStrategies, suggestNextAction } from '../services/geminiService';
import { useToast } from './Toast';

interface DealDetailPanelProps {
  deal: Deal;
  onClose: () => void;
  onActionComplete?: () => void;
}

const DealDetailPanel: React.FC<DealDetailPanelProps> = ({ deal, onClose, onActionComplete }) => {
  const { addToast } = useToast();
  const client = useMemo(() => MOCK_CLIENTS.find(c => c.id === deal.clientId) || MOCK_CLIENTS[0], [deal]);
  const activities = useMemo(() => MOCK_ACTIVITIES.filter(a => a.clientId === client.id), [client]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'activity'>('overview');
  const [analysisHtml, setAnalysisHtml] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [suggestedAction, setSuggestedAction] = useState<{ title: string, type: string, description: string } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);

  // Auto-load suggestion on mount
  useEffect(() => {
    const loadSuggestion = async () => {
      setIsActionLoading(true);
      const lastActivity = activities.length > 0 ? `${activities[0].type} on ${activities[0].date}` : "None";
      const suggestion = await suggestNextAction(client.company, deal.stage, lastActivity);
      setSuggestedAction(suggestion);
      setIsActionLoading(false);
    };
    loadSuggestion();
  }, [deal.id]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setActiveTab('intelligence');
    const history = activities.map(a => `${a.date}: ${a.type} - ${a.content}`).join('\n');
    const result = await analyzeDealStrategies(deal.title, deal.stage, deal.value, client.company, history);
    setAnalysisHtml(result);
    setIsAnalyzing(false);
  };

  const handleExecuteAction = () => {
    setIsExecuting(true);
    // Simulate system execution
    setTimeout(() => {
        setIsExecuting(false);
        setActionComplete(true);
        addToast(`Action Executed: ${suggestedAction?.title}`, 'success');
        if (onActionComplete) onActionComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
        
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-16">
          {/* Panel */}
          <div className="pointer-events-auto w-screen max-w-2xl transform transition-transform duration-500 ease-in-out sm:duration-700 animate-enter h-full">
            <div className="flex h-full flex-col bg-white shadow-xl">
              
              {/* Header */}
              <div className="flex-shrink-0 px-4 py-6 sm:px-6 border-b border-slate-100 bg-white z-20">
                <div className="flex items-start justify-between">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Badge variant={deal.priority === 'High' ? 'danger' : 'neutral'} className="text-[10px] uppercase tracking-wider">{deal.priority} Priority</Badge>
                        <span className="text-xs text-slate-400 font-medium">#{deal.id.toUpperCase()}</span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 leading-6">{deal.title}</h2>
                  </div>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-full bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-1"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{client.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{client.name}</span>
                    </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 scrollbar-stable">
                <div className="px-4 py-6 sm:px-6 space-y-8">
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deal Value</span>
                            <span className="text-xl font-bold text-slate-900">${deal.value.toLocaleString()}</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Probability</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp className={`h-4 w-4 ${deal.probability > 50 ? 'text-emerald-500' : 'text-orange-500'}`} />
                                <span className={`text-xl font-bold ${deal.probability > 50 ? 'text-emerald-600' : 'text-slate-900'}`}>{deal.probability}%</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Close</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary-500" />
                                <span className="text-xl font-bold text-slate-900">{new Date(deal.expectedCloseDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendation Card */}
                    <div className="relative overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-white to-primary-50/50 shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit className="h-32 w-32" />
                        </div>
                        <div className="p-5 relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-primary-100 p-1 rounded-md">
                                    <BrainCircuit className="h-4 w-4 text-primary-600" />
                                </div>
                                <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wide">Recommended Next Step</h3>
                            </div>
                            
                            {isActionLoading ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                                    <div className="h-10 w-32 bg-slate-200 rounded mt-2"></div>
                                </div>
                            ) : actionComplete ? (
                                <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100 flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                    <div>
                                        <p className="font-bold text-emerald-900">Action Completed</p>
                                        <p className="text-sm text-emerald-700">Metrics will update shortly.</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{suggestedAction?.title || 'Review Deal Strategy'}</h4>
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-lg">{suggestedAction?.description || 'AI is analyzing recent signals to determine the best path forward.'}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {suggestedAction && (
                                            <Button 
                                                onClick={handleExecuteAction} 
                                                isLoading={isExecuting}
                                                icon={suggestedAction.type === 'email' ? Mail : suggestedAction.type === 'call' ? Phone : CheckCircle2}
                                                className="shadow-sm"
                                            >
                                                Execute Now
                                            </Button>
                                        )}
                                        <Button variant="secondary" onClick={() => setSuggestedAction(null)}>Dismiss</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div>
                        <div className="border-b border-slate-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('intelligence')}
                                    className={`${activeTab === 'intelligence' ? 'border-fuchsia-500 text-fuchsia-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                                >
                                    <BrainCircuit className="h-4 w-4" /> Intelligence
                                </button>
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`${activeTab === 'activity' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    Activity
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Panels */}
                    <div className="min-h-[300px]">
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-enter">
                                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-xs text-slate-500 block mb-1">Email</span>
                                            <span className="text-sm font-medium text-slate-900 break-all">{client.email}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-xs text-slate-500 block mb-1">Phone</span>
                                            <span className="text-sm font-medium text-slate-900">{client.phone}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-1 sm:col-span-2 flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <div>
                                                <span className="text-xs text-slate-500 block">Location</span>
                                                <span className="text-sm font-medium text-slate-900">San Francisco, CA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notes</h4>
                                        <Button size="sm" variant="ghost" icon={FileText}>Add</Button>
                                    </div>
                                    <div className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        "Client is very interested in the Q3 roadmap. Need to emphasize scalability."
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'intelligence' && (
                            <div className="animate-enter space-y-4">
                                {!analysisHtml && !isAnalyzing && (
                                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                                        <BrainCircuit className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm text-slate-600 mb-4 max-w-xs mx-auto">Generate a deep dive analysis of this deal's probability, risks, and winning strategies.</p>
                                        <Button onClick={handleAnalyze} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md shadow-fuchsia-100">
                                            <BrainCircuit className="h-4 w-4 mr-2" /> Run Deal Doctor
                                        </Button>
                                    </div>
                                )}
                                
                                {isAnalyzing && (
                                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
                                        <Loader2 className="h-8 w-8 text-fuchsia-500 animate-spin mb-4" />
                                        <h3 className="text-slate-900 font-bold">Analyzing Deal Signals...</h3>
                                        <p className="text-slate-500 text-sm mt-2">Connecting to Gemini 3.0 Thinking Mode</p>
                                    </div>
                                )}

                                {analysisHtml && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
                                                <BrainCircuit className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 m-0">Strategic Analysis</h3>
                                                <p className="text-xs text-slate-500 m-0">Generated just now</p>
                                            </div>
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: analysisHtml }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="space-y-6 animate-enter pt-2">
                                {activities.map((activity, idx) => (
                                    <div key={activity.id} className="relative pl-8 group">
                                        {idx !== activities.length - 1 && (
                                            <div className="absolute left-[11px] top-3 bottom-[-24px] w-px bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                                        )}
                                        <div className={`absolute left-0 top-0.5 h-6 w-6 rounded-full border-2 border-white ring-1 ring-slate-200 flex items-center justify-center bg-slate-50 z-10 ${
                                            activity.type === 'Email' ? 'text-blue-500' : activity.type === 'Call' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                            {activity.type === 'Email' ? <Mail className="h-3 w-3" /> : activity.type === 'Call' ? <Phone className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-bold text-slate-900">{activity.type}</span>
                                                <span className="text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{activity.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {activities.length === 0 && (
                                    <p className="text-center text-slate-400 text-sm py-8">No activity recorded yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-slate-200 px-4 py-4 sm:px-6 bg-slate-50 flex justify-between items-center z-20">
                 <button type="button" className="text-sm font-medium text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                     Mark Lost
                 </button>
                 <div className="flex gap-3">
                     <Button variant="secondary" onClick={onClose}>Cancel</Button>
                     <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200">
                         Mark Won
                     </Button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPanel;