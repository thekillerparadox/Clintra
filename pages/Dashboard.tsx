import React, { useState } from 'react';
import { MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, TrendingUp, ArrowUpRight, DollarSign, Calendar, 
    CheckSquare, Clock, ArrowRight, BrainCircuit, Loader2, Target, 
    Users, Briefcase, ChevronRight, MoreHorizontal, Phone, Mail, PlusCircle, Filter,
    MessageSquare, Activity
} from 'lucide-react';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, 
    BarChart, Bar, Cell, PieChart, Pie, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { generateDailyBriefing } from '../services/geminiService';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

// --- Enhanced Mock Data ---
const FORECAST_DATA = [
    { name: 'Week 1', actual: 12000, goal: 15000, projected: 14000 },
    { name: 'Week 2', actual: 28000, goal: 30000, projected: 29000 },
    { name: 'Week 3', actual: 45000, goal: 45000, projected: 48000 },
    { name: 'Week 4', actual: 52000, goal: 60000, projected: 65000 },
];

const FUNNEL_DATA = [
    { name: 'Lead', value: 20 },
    { name: 'Qualify', value: 15 },
    { name: 'Proposal', value: 12 },
    { name: 'Negotiate', value: 8 },
    { name: 'Won', value: 5 },
];

const SOURCE_DATA = [
    { name: 'Referral', value: 35, color: '#8b5cf6' },
    { name: 'Inbound', value: 25, color: '#10b981' },
    { name: 'Outbound', value: 20, color: '#f59e0b' },
    { name: 'Events', value: 10, color: '#3b82f6' },
    { name: 'Ads', value: 10, color: '#f43f5e' },
];

const ACTIVITY_VOLUME_DATA = [
    { name: 'Mon', calls: 12, emails: 24, meetings: 4 },
    { name: 'Tue', calls: 18, emails: 30, meetings: 6 },
    { name: 'Wed', calls: 10, emails: 20, meetings: 3 },
    { name: 'Thu', calls: 15, emails: 28, meetings: 5 },
    { name: 'Fri', calls: 8, emails: 15, meetings: 2 },
];

const FUNNEL_COLORS = ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#10b981'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [briefingHtml, setBriefingHtml] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'meetings'>('tasks');
  const [quickTask, setQuickTask] = useState('');
  
  // Deals Filter State
  const [dealFilter, setDealFilter] = useState<'all' | 'closing' | 'risk'>('all');

  const handleGenerateBriefing = async () => {
      if (briefingHtml) return;
      setIsThinking(true);
      const briefing = await generateDailyBriefing(MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES);
      setBriefingHtml(briefing);
      setIsThinking(false);
  };

  const totalRevenue = MOCK_DEALS.reduce((acc, d) => acc + d.value, 0);
  const goal = 150000;
  const progress = (totalRevenue / goal) * 100;

  // Filter Logic for Deals Table
  const getFilteredDeals = () => {
      const now = new Date();
      switch(dealFilter) {
          case 'closing':
              return MOCK_DEALS.filter(d => {
                  const closeDate = new Date(d.expectedCloseDate);
                  const diffTime = Math.abs(closeDate.getTime() - now.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                  return diffDays <= 30 && d.stage !== 'Won' && d.stage !== 'Lost';
              });
          case 'risk':
              return MOCK_DEALS.filter(d => d.probability < 40 && d.stage !== 'Lost');
          default:
              return MOCK_DEALS;
      }
  };

  const displayedDeals = getFilteredDeals().slice(0, 5);

  return (
    <div className="space-y-6 animate-enter pb-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, John</h1>
              <p className="text-slate-500 text-sm mt-1">Here's what's happening in your pipeline today.</p>
          </div>
          <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerateBriefing} 
                disabled={isThinking}
                className={`bg-white transition-all ${briefingHtml ? 'hidden' : ''}`}
              >
                  {isThinking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
                  {isThinking ? 'Thinking...' : 'Generate Daily Briefing'}
              </Button>
              <Button icon={ArrowRight} onClick={() => navigate('/pipeline')}>Go to Pipeline</Button>
          </div>
      </div>

      {/* --- AI BRIEFING PANEL (Conditional) --- */}
      {(isThinking || briefingHtml) && (
          <div className="bg-gradient-to-r from-fuchsia-50 to-white border border-fuchsia-100 rounded-xl p-6 shadow-sm animate-enter">
              <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-fuchsia-100 rounded-lg flex items-center justify-center text-fuchsia-600">
                      <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900">Executive Daily Briefing</h3>
                      <p className="text-xs text-slate-500">Powered by Gemini 3.0 Thinking Mode</p>
                  </div>
              </div>
              
              {isThinking ? (
                  <div className="space-y-3 max-w-2xl">
                      <div className="h-4 bg-fuchsia-100/50 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-fuchsia-100/50 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-fuchsia-100/50 rounded w-5/6 animate-pulse"></div>
                  </div>
              ) : (
                  <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: briefingHtml || '' }} />
              )}
          </div>
      )}

      {/* --- KPI ROW (High Density) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
             title="Forecast vs Quota"
             value={`$${(totalRevenue/1000).toFixed(0)}k`}
             subValue={`of $${(goal/1000).toFixed(0)}k Goal`}
             icon={Target}
             color="text-primary-600"
             trend="+12%"
             trendUp={true}
          >
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
          </KPICard>

          <KPICard 
             title="Sales Velocity"
             value="18 Days"
             subValue="Avg time to close"
             icon={Clock}
             color="text-blue-600"
             trend="-2 days"
             trendUp={true} // Lower is better for velocity usually, but green implies good
          >
               <div className="h-1.5 mt-3 flex gap-1">
                   <div className="h-full w-1/3 bg-blue-200 rounded-full"></div>
                   <div className="h-full w-1/3 bg-blue-400 rounded-full"></div>
                   <div className="h-full w-1/3 bg-blue-600 rounded-full"></div>
               </div>
          </KPICard>

          <KPICard 
             title="Win Rate"
             value="32%"
             subValue="Trailing 30 days"
             icon={TrendingUp}
             color="text-emerald-600"
             trend="+4.5%"
             trendUp={true}
          >
             <div className="mt-3 h-8 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={[{v:20},{v:22},{v:28},{v:25},{v:30},{v:32}]}>
                         <Area type="monotone" dataKey="v" stroke="#10b981" fill="#ecfdf5" strokeWidth={2} />
                     </AreaChart>
                 </ResponsiveContainer>
             </div>
          </KPICard>

          <KPICard 
             title="Active Pipeline"
             value="$245k"
             subValue="12 Open Deals"
             icon={DollarSign}
             color="text-fuchsia-600"
             trend="+8%"
             trendUp={true}
          >
             <div className="mt-3 flex gap-1 h-1.5 w-full">
                  <div className="bg-primary-500 w-[40%] rounded-l-full"></div>
                  <div className="bg-fuchsia-500 w-[30%]"></div>
                  <div className="bg-emerald-500 w-[30%] rounded-r-full"></div>
             </div>
          </KPICard>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[600px]">
          
          {/* Revenue Performance (2/3) */}
          <div className="lg:col-span-2 h-[500px] lg:h-full">
              <Card className="h-full flex flex-col" noPadding>
                  <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0 bg-white sticky top-0 z-10">
                      <div>
                          <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
                          <p className="text-xs text-slate-500">Actual vs Projected vs Goal</p>
                      </div>
                      <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600">
                              <Filter className="h-4 w-4" />
                          </button>
                          <select className="bg-slate-50 border-none text-xs rounded-lg px-3 py-1.5 text-slate-600 focus:ring-2 focus:ring-primary-100 font-medium">
                              <option>This Quarter</option>
                              <option>Last Quarter</option>
                              <option>YTD</option>
                          </select>
                      </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-0 overflow-y-auto px-6 py-4 scrollbar-stable">
                      {/* Chart Section */}
                      <div className="h-[300px] w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                <Area type="monotone" dataKey="actual" name="Actual Revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                                <Area type="monotone" dataKey="projected" name="Projected" stroke="#3b82f6" fill="none" strokeDasharray="5 5" strokeWidth={2} />
                                <Area type="monotone" dataKey="goal" name="Goal" stroke="#cbd5e1" fill="none" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Forecast Contributing Deals */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <TrendingUp className="h-3 w-3" /> Contributors to Forecast
                          </h4>
                          <div className="space-y-3">
                              {MOCK_DEALS.slice(0, 5).map((deal, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-primary-200 transition-colors cursor-pointer">
                                      <div className="flex items-center gap-3">
                                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${deal.probability > 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                              {deal.probability}%
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-slate-900">{deal.title}</p>
                                              <p className="text-xs text-slate-500">Closing {new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                                          </div>
                                      </div>
                                      <span className="text-sm font-bold text-slate-900">${deal.value.toLocaleString()}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </Card>
          </div>

          {/* My Day Widget (1/3) */}
          <div className="lg:col-span-1 h-[500px] lg:h-full">
              <Card className="h-full flex flex-col" noPadding>
                  <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white sticky top-0 z-10">
                      <h3 className="font-bold text-slate-900">My Day</h3>
                      <div className="flex bg-slate-100 rounded-lg p-0.5">
                          <button 
                            onClick={() => setActiveTab('tasks')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                          >
                              Tasks
                          </button>
                          <button 
                            onClick={() => setActiveTab('meetings')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'meetings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                          >
                              Meetings
                          </button>
                      </div>
                  </div>
                  
                  {/* Quick Add */}
                  <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                      <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Add a new task..." 
                            value={quickTask}
                            onChange={(e) => setQuickTask(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700">
                              <PlusCircle className="h-4 w-4" />
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 scrollbar-stable">
                      {activeTab === 'tasks' ? (
                          <div className="space-y-2">
                              {MOCK_TASKS.map(task => (
                                  <div key={task.id} className="p-3 bg-white hover:bg-slate-50 rounded-lg group transition-all border border-slate-100 hover:border-primary-100 hover:shadow-sm">
                                      <div className="flex items-start gap-3 mb-2">
                                          <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${task.priority === 'High' ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-300 text-slate-400'}`}>
                                              {task.priority === 'High' && <AlertTriangle className="h-2 w-2" />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                  <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}
                                              </p>
                                          </div>
                                      </div>
                                      
                                      {/* Quick Actions for Task */}
                                      <div className="flex gap-2 pl-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="text-[10px] font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:border-primary-200">
                                              <CheckSquare className="h-3 w-3" /> Complete
                                          </button>
                                          <button className="text-[10px] font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:border-primary-200">
                                              <Clock className="h-3 w-3" /> Reschedule
                                          </button>
                                      </div>
                                  </div>
                              ))}
                              {/* Duplicates for scrolling demo */}
                              {MOCK_TASKS.map(task => (
                                  <div key={`${task.id}-dup`} className="p-3 bg-white hover:bg-slate-50 rounded-lg group transition-all border border-slate-100 hover:border-primary-100 hover:shadow-sm">
                                      <div className="flex items-start gap-3 mb-2">
                                          <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${task.priority === 'High' ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-300 text-slate-400'}`}>
                                              {task.priority === 'High' && <AlertTriangle className="h-2 w-2" />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                  <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="space-y-2">
                              {[1, 2, 3, 4, 5, 6].map(i => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-white hover:bg-slate-50 rounded-lg group transition-colors border border-slate-100 hover:border-primary-100">
                                      <div className="flex flex-col items-center bg-blue-50 text-blue-700 rounded p-1.5 min-w-[3rem]">
                                          <span className="text-[10px] font-bold uppercase">Today</span>
                                          <span className="text-sm font-bold">2:00</span>
                                      </div>
                                      <div className="flex-1">
                                          <p className="text-sm font-medium text-slate-900">Demo with Acme Corp</p>
                                          <p className="text-xs text-slate-500 mt-0.5">Google Meet • 45 min</p>
                                          
                                          <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="Join Call">
                                                  <Phone className="h-3 w-3" />
                                              </button>
                                              <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Email Participants">
                                                  <Mail className="h-3 w-3" />
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </Card>
          </div>

      </div>

      {/* --- BOTTOM ROW: Insights & Tables --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Opportunities (2/3) */}
          <Card noPadding className="flex flex-col lg:col-span-2">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <h3 className="font-bold text-slate-900">Recent Opportunities</h3>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg">
                          <button 
                            onClick={() => setDealFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${dealFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                          >
                              All
                          </button>
                          <button 
                            onClick={() => setDealFilter('closing')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${dealFilter === 'closing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                          >
                              Closing Soon
                          </button>
                          <button 
                            onClick={() => setDealFilter('risk')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${dealFilter === 'risk' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                          >
                              At Risk
                          </button>
                      </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={ArrowRight}>View All</Button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                          <tr>
                              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Deal Name</th>
                              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Stage</th>
                              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider">Value</th>
                              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {displayedDeals.length > 0 ? displayedDeals.map(deal => (
                              <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                                  <td className="px-5 py-3">
                                      <div className="font-bold text-slate-900">{deal.title}</div>
                                      <div className="text-xs text-slate-500">Acme Corp</div>
                                  </td>
                                  <td className="px-5 py-3">
                                      <Badge variant="neutral" className="text-[10px]">{deal.stage}</Badge>
                                  </td>
                                  <td className="px-5 py-3 font-medium text-slate-900">
                                      ${deal.value.toLocaleString()}
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                      <button 
                                        onClick={() => navigate(`/deals/${deal.id}`)}
                                        className="text-slate-400 hover:text-primary-600 transition-colors"
                                      >
                                          <ChevronRight className="h-5 w-5" />
                                      </button>
                                  </td>
                              </tr>
                          )) : (
                              <tr>
                                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500 text-sm italic">
                                      No deals match this filter.
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </Card>

          {/* Marketing & Funnel Insights (1/3) */}
          <div className="lg:col-span-1 space-y-6">
              {/* Activity Volume (New) */}
              <Card className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-slate-400" /> Activity Volume
                      </h3>
                  </div>
                  <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ACTIVITY_VOLUME_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px'}}
                              />
                              <Legend iconType="circle" wrapperStyle={{paddingTop: '10px', fontSize: '10px'}} />
                              <Bar dataKey="calls" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={12} />
                              <Bar dataKey="emails" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={12} />
                              <Bar dataKey="meetings" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </Card>

              {/* Conversion Funnel */}
              <Card className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900">Conversion Funnel</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={200}>
                          <BarChart layout="vertical" data={FUNNEL_DATA} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: 'transparent'}} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                  {FUNNEL_DATA.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index]} />
                                  ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </Card>
              
              {/* Lead Sources (New) */}
              <Card className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900">Lead Sources</h3>
                  </div>
                  <div className="flex items-center">
                      <div className="h-[160px] w-1/2">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={SOURCE_DATA}
                                      innerRadius={40}
                                      outerRadius={60}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {SOURCE_DATA.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 space-y-2">
                          {SOURCE_DATA.slice(0, 3).map((entry) => (
                              <div key={entry.name} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                      <span className="text-slate-600">{entry.name}</span>
                                  </div>
                                  <span className="font-bold text-slate-900">{entry.value}%</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </Card>
          </div>

      </div>

    </div>
  );
};

const KPICard = ({ title, value, subValue, icon: Icon, color, trend, trendUp, children }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                {trend}
            </div>
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
        </div>
        {children}
    </div>
);

export default Dashboard;