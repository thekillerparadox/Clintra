import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_CLIENTS, MOCK_ACTIVITIES, MOCK_DEALS, MOCK_TASKS } from '../constants';
import { 
  Mail, Phone, MapPin, Calendar, Plus, ArrowRight, Clock, 
  MessageSquare, Globe, Sparkles, Loader2, ExternalLink, 
  FileText, Paperclip, MoreHorizontal, Tag, Search, Send,
  CheckCircle2, Layout, Bell, ChevronLeft, Briefcase, TrendingUp
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { researchEntity, generateAccountStrategy } from '../services/geminiService';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Dynamic Data Retrieval
  const client = useMemo(() => 
    MOCK_CLIENTS.find(c => c.id === id) || MOCK_CLIENTS[0], 
  [id]);
  
  const primaryDeal = useMemo(() => 
    MOCK_DEALS.find(d => d.clientId === client.id) || 
    { title: 'No Active Deal', stage: 'N/A', probability: 0, value: 0 }, 
  [client.id]);

  const activities = useMemo(() => MOCK_ACTIVITIES.filter(a => a.clientId === client.id), [client.id]);
  const tasks = useMemo(() => MOCK_TASKS.filter(t => t.relatedClientId === client.id), [client.id]);
  const otherDeals = useMemo(() => MOCK_DEALS.filter(d => d.clientId === client.id && d.id !== (primaryDeal as any).id), [client.id, primaryDeal]);

  // AI State
  const [researchData, setResearchData] = useState<{text: string, sources: Array<{title: string, uri: string}>} | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  
  const [strategyHtml, setStrategyHtml] = useState<string | null>(null);
  const [isStrategizing, setIsStrategizing] = useState(false);

  const [noteInput, setNoteInput] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'strategy'>('activity');

  const handleResearch = async () => {
    if (researchData) return;
    setIsResearching(true);
    const data = await researchEntity(client.company);
    setResearchData(data);
    setIsResearching(false);
  };

  const handleStrategy = async () => {
    if (strategyHtml) {
        setActiveTab('strategy');
        return;
    }
    setIsStrategizing(true);
    setActiveTab('strategy');
    // Simulate history context for the prompt
    const historyContext = activities.map(a => `${a.type}: ${a.content}`).join("; ");
    const strategy = await generateAccountStrategy(client.company, historyContext);
    setStrategyHtml(strategy);
    setIsStrategizing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-enter">
      
      {/* Back Nav */}
      <div className="mb-6">
        <Link to="/contacts" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Contacts
        </Link>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* === LEFT COLUMN: Context (30%) === */}
        <div className="lg:col-span-3 space-y-6">
            
            {/* Client Summary Card */}
            <Card noPadding className="p-5 space-y-5 sticky top-6 border-slate-200/60 shadow-lg shadow-slate-200/40">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 group cursor-pointer">
                        <div className="p-1 rounded-full border-2 border-slate-100 group-hover:border-primary-200 transition-colors">
                            <img src={client.avatar} alt={client.name} className="h-24 w-24 rounded-full object-cover" />
                        </div>
                        <div className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">{client.name}</h1>
                    <p className="text-sm text-slate-500 font-medium">{client.company}</p>
                    
                    <div className="flex gap-2 mt-5 w-full">
                        <Button variant="secondary" size="sm" className="flex-1" icon={Phone}>Call</Button>
                        <Button variant="secondary" size="sm" className="flex-1" icon={Mail}>Email</Button>
                    </div>
                </div>
                
                <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Status</span>
                        <Badge variant={client.status === 'Active' ? 'success' : 'neutral'}>{client.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Location</span>
                        <span className="font-medium text-slate-700">San Francisco</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Timezone</span>
                        <span className="font-medium text-slate-700">PST (UTC-8)</span>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {['VIP', 'Tech', 'Referral'].map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:border-primary-200 hover:text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer">
                                {tag}
                            </span>
                        ))}
                        <button className="h-6 w-6 flex items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleResearch} 
                        disabled={isResearching}
                        className="w-full justify-start text-primary-600 hover:bg-primary-50 font-medium"
                    >
                        {isResearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                        {isResearching ? 'Analyzing...' : 'AI Research Company'}
                    </Button>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleStrategy} 
                        disabled={isStrategizing}
                        className="w-full justify-start text-fuchsia-600 hover:bg-fuchsia-50 font-medium"
                    >
                        {isStrategizing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Briefcase className="h-4 w-4 mr-2" />}
                        {isStrategizing ? 'Thinking...' : 'Generate Account Strategy'}
                    </Button>
                </div>
            </Card>
        </div>

        {/* === MIDDLE COLUMN: Execution (45%) === */}
        <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Deal Card (Top Anchor) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lift transition-all duration-300 ease-spring">
                <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-md border border-primary-200/50">
                            {primaryDeal.stage}
                        </div>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                             Probability: <span className="text-slate-900 font-bold">{primaryDeal.probability}%</span>
                        </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">${primaryDeal.value.toLocaleString()}</div>
                </div>
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                         <h2 className="text-xl font-bold text-slate-900">{primaryDeal.title}</h2>
                         <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                             <TrendingUp className="h-4 w-4" />
                         </div>
                    </div>
                    
                    {/* Primary Actions Row */}
                    <div className="flex gap-3 mb-6">
                        <Button variant="primary" size="sm" icon={Plus}>Log Activity</Button>
                        <Button variant="secondary" size="sm" icon={Bell}>Remind</Button>
                        <Button variant="secondary" size="sm" icon={Paperclip}>Attach</Button>
                    </div>

                    {/* AI Research Result (In-flow) */}
                    {researchData && (
                        <div className="mb-6 bg-primary-50/50 rounded-lg border border-primary-100 p-4 animate-enter">
                            <h3 className="font-bold text-primary-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-primary-600" /> Market Context
                            </h3>
                            <p className="text-sm text-primary-900/80 leading-relaxed whitespace-pre-line mb-3">{researchData.text}</p>
                            <div className="flex flex-wrap gap-2">
                                {researchData.sources.map((s, i) => (
                                    <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 underline decoration-primary-200 hover:decoration-primary-600 transition-all truncate max-w-[200px]">
                                        {s.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-6 px-1">
                <button 
                    onClick={() => setActiveTab('activity')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'activity' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Activity
                </button>
                <button 
                    onClick={() => setActiveTab('strategy')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'strategy' ? 'border-fuchsia-600 text-fuchsia-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Strategy & Growth
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'activity' ? (
                    <div className="relative pt-6">
                        <div className="absolute left-[20px] top-6 bottom-0 w-px bg-slate-200"></div>
                        
                        <div className="space-y-6">
                            {/* Activity Composer */}
                            <div className="relative pl-12">
                                <div className="absolute left-[11px] top-3 h-5 w-5 bg-slate-100 rounded-full border-2 border-white ring-1 ring-slate-200 flex items-center justify-center">
                                    <Plus className="h-3 w-3 text-slate-400" />
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                                    <textarea 
                                        className="w-full text-sm resize-none border-none focus:ring-0 placeholder:text-slate-400 min-h-[40px]"
                                        placeholder="Write a note..."
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                    />
                                    {noteInput && (
                                        <div className="flex justify-end mt-2 pt-2 border-t border-slate-50">
                                            <Button size="sm">Save Note</Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline Items */}
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative pl-12 group cursor-pointer">
                                    <div className={`absolute left-[11px] top-1.5 h-5 w-5 rounded-full border-2 border-white ring-1 ring-slate-200 flex items-center justify-center bg-white z-10 transition-colors duration-300 group-hover:ring-primary-300`}>
                                        <div className={`h-2 w-2 rounded-full ${
                                            activity.type === 'Email' ? 'bg-blue-500' :
                                            activity.type === 'Call' ? 'bg-emerald-500' : 'bg-orange-500'
                                        }`}></div>
                                    </div>
                                    
                                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-spring">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-sm font-bold text-slate-900">{activity.type}</span>
                                            <span className="text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{activity.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="pt-6 animate-enter">
                         {isStrategizing ? (
                             <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                 <Loader2 className="h-8 w-8 text-fuchsia-500 animate-spin mb-4" />
                                 <h3 className="text-slate-900 font-bold">Thinking...</h3>
                                 <p className="text-slate-500 text-sm max-w-xs mt-2">Our AI is analyzing activity history and market trends to build a custom strategy.</p>
                             </div>
                         ) : strategyHtml ? (
                             <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-ul:list-disc prose-li:text-slate-700">
                                 <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                     <div className="h-8 w-8 bg-fuchsia-100 rounded-lg flex items-center justify-center text-fuchsia-600">
                                         <Briefcase className="h-4 w-4" />
                                     </div>
                                     <div>
                                         <h3 className="text-lg font-bold text-slate-900 m-0">Strategic Account Plan</h3>
                                         <p className="text-xs text-slate-500 m-0">Generated by Clientra Intelligence</p>
                                     </div>
                                 </div>
                                 <div dangerouslySetInnerHTML={{ __html: strategyHtml }} />
                                 <div className="mt-8 flex gap-3">
                                     <Button variant="outline" size="sm">Download PDF</Button>
                                     <Button variant="secondary" size="sm">Copy to Clipboard</Button>
                                 </div>
                             </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                 <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center text-fuchsia-500 mb-4">
                                     <Briefcase className="h-6 w-6" />
                                 </div>
                                 <h3 className="text-slate-900 font-bold">No Strategy Generated Yet</h3>
                                 <p className="text-slate-500 text-sm max-w-xs mt-2 mb-6">Generate a growth plan based on recent interactions and potential market opportunities.</p>
                                 <Button onClick={handleStrategy} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Generate Strategy</Button>
                             </div>
                         )}
                    </div>
                )}
            </div>
        </div>

        {/* === RIGHT COLUMN: Utility & Context (25%) === */}
        <div className="lg:col-span-3 space-y-6 sticky top-6">
            
            {/* Upcoming Reminders */}
            <Card noPadding>
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming</h3>
                    <button className="text-slate-400 hover:text-primary-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <div className="divide-y divide-slate-50">
                    {tasks.length > 0 ? tasks.map(task => (
                        <div key={task.id} className="p-3 hover:bg-slate-50 transition-colors group flex items-start gap-3">
                            <div className={`mt-0.5 h-4 w-4 rounded border ${task.priority === 'High' ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-300 text-slate-400'} flex items-center justify-center cursor-pointer hover:border-primary-400 hover:text-primary-600 transition-colors`}>
                                {task.completed && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-xs text-slate-400">No upcoming tasks</div>
                    )}
                </div>
            </Card>

            {/* Files / Attachments */}
            <Card noPadding>
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attachments</h3>
                    <button className="text-slate-400 hover:text-primary-600 transition-colors"><Paperclip className="h-3.5 w-3.5" /></button>
                </div>
                <div className="p-2 space-y-1">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-600 transition-colors group">
                            <FileText className="h-4 w-4 text-slate-400 group-hover:text-primary-500" />
                            <span className="truncate group-hover:text-slate-900">Proposal_Draft_v{i}.pdf</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Related Deals (Mini) */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Other Deals</h3>
                <div className="space-y-2">
                    {otherDeals.map(d => (
                        <div key={d.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-primary-300 hover:shadow-md cursor-pointer transition-all">
                             <div className="text-sm font-bold text-slate-900">{d.title}</div>
                             <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                <span>{d.stage}</span>
                                <span className="font-medium text-slate-700">${d.value.toLocaleString()}</span>
                             </div>
                        </div>
                    ))}
                    {otherDeals.length === 0 && (
                        <div className="text-xs text-slate-400 italic pl-1">No other deals active</div>
                    )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default ClientProfile;