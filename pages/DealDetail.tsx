import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DEALS, MOCK_CLIENTS, MOCK_ACTIVITIES, MOCK_TASKS } from '../constants';
import { DealStage } from '../types';
import { 
  ChevronLeft, Calendar, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Plus, MoreHorizontal, BrainCircuit, Loader2,
  FileText, User
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { analyzeDealStrategies } from '../services/geminiService';

const STAGES = Object.values(DealStage);

const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const deal = useMemo(() => MOCK_DEALS.find(d => d.id === id) || MOCK_DEALS[0], [id]);
  const client = useMemo(() => MOCK_CLIENTS.find(c => c.id === deal.clientId) || MOCK_CLIENTS[0], [deal]);
  const activities = useMemo(() => MOCK_ACTIVITIES.filter(a => a.clientId === client.id), [client]);
  const tasks = useMemo(() => MOCK_TASKS.filter(t => t.relatedDealId === deal.id), [deal]);

  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'activity'>('overview');
  const [analysisHtml, setAnalysisHtml] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (analysisHtml) {
        setActiveTab('intelligence');
        return;
    }
    setIsAnalyzing(true);
    setActiveTab('intelligence');
    const history = activities.map(a => `${a.date}: ${a.type} - ${a.content}`).join('\n');
    const result = await analyzeDealStrategies(deal.title, deal.stage, deal.value, client.company, history);
    setAnalysisHtml(result);
    setIsAnalyzing(false);
  };

  const currentStageIndex = STAGES.indexOf(deal.stage);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-enter">
        {/* Back Nav */}
        <div className="mb-6 flex items-center justify-between">
            <Link to="/pipeline" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
            </Link>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm">Edit Deal</Button>
                <Button variant="primary" size="sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <BrainCircuit className="h-4 w-4 mr-2" />}
                    {isAnalyzing ? 'Thinking...' : 'AI Deal Doctor'}
                </Button>
            </div>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deal #{deal.id.toUpperCase()}</span>
                        <Badge variant={deal.priority === 'High' ? 'danger' : 'neutral'}>{deal.priority} Priority</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{deal.title}</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <User className="h-4 w-4" />
                        <Link to={`/contacts/${client.id}`} className="hover:text-primary-600 hover:underline transition-colors font-medium">
                            {client.company}
                        </Link>
                        <span className="mx-1">•</span>
                        <span>{client.name}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-bold text-slate-900 mb-1">${deal.value.toLocaleString()}</div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                             <TrendingUp className="h-4 w-4 text-emerald-500" />
                             <span className="font-bold">{deal.probability}%</span> Probability
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                             <Calendar className="h-4 w-4 text-slate-400" />
                             Close: <span className="font-medium">{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stage Stepper */}
            <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                    {STAGES.map((stage, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        return (
                            <div 
                                key={stage} 
                                style={{ width: `${100 / STAGES.length}%` }} 
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                    isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-primary-600' : 'bg-transparent'
                                }`}
                            ></div>
                        )
                    })}
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                    {STAGES.map((stage, idx) => (
                        <div key={stage} className={`${idx === currentStageIndex ? 'text-primary-700 font-bold' : ''}`}>
                            {stage}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Tabs */}
                <div className="border-b border-slate-200 flex gap-6 px-1">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('intelligence')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'intelligence' ? 'border-fuchsia-600 text-fuchsia-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BrainCircuit className="h-4 w-4" /> Intelligence
                    </button>
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'activity' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Activity
                    </button>
                </div>

                {/* Tab Views */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 pt-2 animate-enter">
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Deal Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deal Owner</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">JD</div>
                                            <span className="text-sm font-medium text-slate-900">John Doe</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deal Age</div>
                                        <div className="text-sm font-medium text-slate-900">45 Days</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Source</div>
                                        <div className="text-sm font-medium text-slate-900">Referral</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Step</div>
                                        <div className="text-sm font-medium text-slate-900">{deal.nextAction || 'Not set'}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Notes</h3>
                                    <Button size="sm" variant="ghost" icon={Plus}>Add Note</Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                                        <p className="font-bold text-slate-900 mb-1">Requirements Gathering</p>
                                        Client emphasized the need for a mobile-first approach. Budget is flexible if we can demonstrate ROI on conversion rates.
                                        <div className="mt-2 text-xs text-slate-400">Added 5 days ago by John Doe</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'intelligence' && (
                        <div className="pt-2 animate-enter">
                             {isAnalyzing ? (
                                 <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                     <Loader2 className="h-8 w-8 text-fuchsia-500 animate-spin mb-4" />
                                     <h3 className="text-slate-900 font-bold">Analyzing Deal Dynamics...</h3>
                                     <p className="text-slate-500 text-sm max-w-xs mt-2">Thinking through risks, historical patterns, and negotiation leverage.</p>
                                 </div>
                             ) : analysisHtml ? (
                                 <div className="bg-white rounded-xl border border-fuchsia-100 shadow-sm p-8 prose prose-sm prose-slate max-w-none">
                                     <div className="flex items-center gap-3 mb-6 pb-4 border-b border-fuchsia-50">
                                         <div className="h-10 w-10 bg-fuchsia-100 rounded-lg flex items-center justify-center text-fuchsia-600 shadow-sm">
                                             <BrainCircuit className="h-5 w-5" />
                                         </div>
                                         <div>
                                             <h3 className="text-lg font-bold text-slate-900 m-0">Deal Doctor Analysis</h3>
                                             <p className="text-xs text-slate-500 m-0">Powered by Gemini 3.0 Thinking Mode</p>
                                         </div>
                                     </div>
                                     <div dangerouslySetInnerHTML={{ __html: analysisHtml }} />
                                     
                                     <div className="mt-8 p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100 flex gap-4 items-start">
                                         <AlertTriangle className="h-5 w-5 text-fuchsia-600 shrink-0 mt-0.5" />
                                         <div>
                                             <h4 className="text-sm font-bold text-fuchsia-900 m-0">AI Disclaimer</h4>
                                             <p className="text-xs text-fuchsia-800 m-0 mt-1">This analysis is generated based on available CRM data. Always verify critical details with the client directly.</p>
                                         </div>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                     <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center text-fuchsia-500 mb-6">
                                         <BrainCircuit className="h-8 w-8" />
                                     </div>
                                     <h3 className="text-slate-900 font-bold text-lg mb-2">Unlock Deal Insights</h3>
                                     <p className="text-slate-500 text-sm max-w-md mb-8">
                                         Use our advanced Thinking Mode to evaluate deal health, identify hidden risks, and generate closing strategies based on communication history.
                                     </p>
                                     <Button onClick={handleAnalyze} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-200">
                                         Run Deal Analysis
                                     </Button>
                                 </div>
                             )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                         <div className="pt-2 space-y-6">
                             {activities.map((activity) => (
                                <div key={activity.id} className="relative pl-8 group pb-6 border-l border-slate-200 last:border-0 ml-3">
                                    <div className={`absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full border-2 border-white ring-1 ring-slate-200 bg-slate-400`}></div>
                                    <div className="text-xs text-slate-400 mb-1">{new Date(activity.date).toLocaleDateString()}</div>
                                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                        <div className="font-bold text-slate-900 text-sm mb-1">{activity.type}</div>
                                        <p className="text-sm text-slate-600">{activity.content}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
                
                {/* Associated Tasks */}
                <Card noPadding>
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks</h3>
                        <button className="text-slate-400 hover:text-primary-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div key={task.id} className="p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                                <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center ${task.completed ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-slate-300'}`}>
                                    {task.completed && <CheckCircle2 className="h-3 w-3" />}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-xs text-slate-400">No tasks for this deal</div>
                        )}
                    </div>
                </Card>

                {/* Files */}
                <Card noPadding>
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Files</h3>
                        <button className="text-slate-400 hover:text-primary-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="p-2 space-y-1">
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-600 transition-colors group">
                            <FileText className="h-4 w-4 text-slate-400 group-hover:text-primary-500" />
                            <span className="truncate group-hover:text-slate-900">Contract_Draft_v2.pdf</span>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    </div>
  );
};

export default DealDetail;