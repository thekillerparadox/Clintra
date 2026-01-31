import React, { useMemo } from 'react';
import { MOCK_DEALS, MOCK_ACTIVITIES, MOCK_TASKS } from '../constants';
import { DealStage, Deal } from '../types';
import { 
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, DollarSign, 
  Activity, Calendar, Clock, CheckCircle2, MoreHorizontal, Mail, Phone,
  Briefcase, ArrowUpRight, ChevronRight, Zap
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useNavigate } from 'react-router-dom';

// --- Components ---

const KPICard: React.FC<{
  label: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
}> = ({ label, value, subValue, trend, trendValue, icon: Icon }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] hover:border-primary-200 transition-all duration-200 group cursor-pointer relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform scale-150 translate-x-2 -translate-y-2">
      <Icon className="w-24 h-24 text-slate-900" />
    </div>
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
          <Icon className="w-5 h-5 text-slate-500 group-hover:text-primary-600 transition-colors" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 
          trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</h3>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        <p className="text-xs font-medium text-slate-400 group-hover:text-primary-600 transition-colors">
          {subValue}
        </p>
      </div>
    </div>
  </div>
);

const PipelineBar: React.FC<{ stage: string; count: number; value: number; totalValue: number; stalledCount: number }> = ({ 
  stage, count, value, totalValue, stalledCount 
}) => {
  const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
  
  return (
    <div className="group flex items-center gap-4 py-3 hover:bg-slate-50 rounded-lg px-2 transition-colors cursor-pointer">
      <div className="w-24 shrink-0">
        <div className="text-sm font-bold text-slate-700 truncate">{stage}</div>
        <div className="text-[10px] text-slate-400 font-medium">{count} deals</div>
      </div>
      
      <div className="flex-1">
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out relative group-hover:bg-primary-600"
            style={{ width: `${Math.max(percentage, 2)}%` }} // Min width for visibility
          ></div>
        </div>
      </div>

      <div className="w-24 shrink-0 text-right">
        <div className="text-sm font-bold text-slate-900">${value.toLocaleString()}</div>
        {stalledCount > 0 ? (
          <div className="text-[10px] font-bold text-amber-600 flex items-center justify-end gap-1">
            <AlertTriangle className="w-3 h-3" /> {stalledCount} stalled
          </div>
        ) : (
          <div className="text-[10px] text-slate-400">On track</div>
        )}
      </div>
      
      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

// --- Main Dashboard ---

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- Data Calculations ---
  const activeDeals = useMemo(() => MOCK_DEALS.filter(d => d.stage !== DealStage.WON && d.stage !== DealStage.LOST), []);
  const totalValue = useMemo(() => activeDeals.reduce((sum, d) => sum + d.value, 0), [activeDeals]);
  
  // Weighted Forecast (Value * Probability)
  const weightedForecast = useMemo(() => 
    activeDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0), 
  [activeDeals]);

  // Stage Breakdown
  const dealsByStage = useMemo(() => {
    const stages = Object.values(DealStage).filter(s => s !== DealStage.LOST);
    return stages.map(stage => {
      const stageDeals = MOCK_DEALS.filter(d => d.stage === stage);
      const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
      const stalledCount = stageDeals.filter(d => {
        const days = Math.floor((Date.now() - new Date(d.lastActivityDate).getTime()) / (1000 * 3600 * 24));
        return days > 7;
      }).length;
      return { stage, count: stageDeals.length, value: stageValue, stalledCount };
    });
  }, []);

  // Risks (Stalled > 7 days OR High Value & Low Prob)
  const risks = useMemo(() => {
    return activeDeals.filter(d => {
      const daysInactive = Math.floor((Date.now() - new Date(d.lastActivityDate).getTime()) / (1000 * 3600 * 24));
      return daysInactive > 7 || (d.value > 10000 && d.probability < 40);
    }).map(d => ({
      ...d,
      daysInactive: Math.floor((Date.now() - new Date(d.lastActivityDate).getTime()) / (1000 * 3600 * 24)),
      type: d.value > 10000 && d.probability < 40 ? 'Risk' : 'Stalled'
    })).slice(0, 4); // Limit to 4
  }, [activeDeals]);

  // Momentum (Recent Activity)
  const momentum = useMemo(() => {
    return MOCK_ACTIVITIES.slice(0, 5).map(a => {
        // Mock finding deal/client name for context
        return { ...a, entityName: 'Project Alpha' }; 
    });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-8 animate-enter">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
             Here is your business performance for <span className="text-slate-900">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>.
          </p>
        </div>
        <div className="flex gap-3">
             <Button variant="secondary" icon={Briefcase} onClick={() => navigate('/pipeline')}>View Pipeline</Button>
        </div>
      </div>

      {/* 1. Business Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total Pipeline" 
          value={`$${totalValue.toLocaleString()}`} 
          subValue={`${activeDeals.length} active deals`}
          trend="up" 
          trendValue="12%"
          icon={DollarSign}
        />
        <KPICard 
          label="Weighted Forecast" 
          value={`$${Math.round(weightedForecast).toLocaleString()}`} 
          subValue="Risk-adjusted revenue"
          trend="up" 
          trendValue="5%"
          icon={Activity}
        />
        <KPICard 
          label="Est. Closing Soon" 
          value="$18,500" 
          subValue="3 deals closing this month"
          trend="neutral" 
          trendValue="0%"
          icon={Calendar}
        />
      </div>

      {/* 2. Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Pipeline Velocity & Health */}
            <Card noPadding className="flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                           <Briefcase className="w-4 h-4 text-slate-500" /> Pipeline Snapshot
                        </h2>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Total Value</span>
                </div>
                <div className="p-6">
                    <div className="space-y-1">
                        {dealsByStage.map((s) => (
                            <PipelineBar 
                                key={s.stage} 
                                {...s} 
                                totalValue={dealsByStage.reduce((sum, item) => sum + item.value, 0)} // Total including won/lost for scale
                            />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Momentum Feed */}
            <Card noPadding>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Momentum Feed
                    </h2>
                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </div>
                <div className="divide-y divide-slate-50">
                    {momentum.map((item) => (
                        <div key={item.id} className="px-6 py-4 hover:bg-slate-50 transition-colors group cursor-pointer flex gap-4">
                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                                item.type === 'Email' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                item.type === 'Call' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                'bg-slate-50 border-slate-200 text-slate-500'
                            }`}>
                                {item.type === 'Email' ? <Mail className="w-3.5 h-3.5" /> : 
                                 item.type === 'Call' ? <Phone className="w-3.5 h-3.5" /> : 
                                 <Activity className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 font-medium group-hover:text-primary-600 transition-colors">
                                    {item.content}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-500 font-medium">{item.type}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Attention Center (Risk) */}
            <Card noPadding className="border-amber-200 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.15)]">
                 <div className="px-5 py-4 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Attention Required
                    </h2>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        {risks.length}
                    </span>
                 </div>
                 <div className="divide-y divide-amber-50">
                    {risks.length > 0 ? risks.map(risk => (
                        <div key={risk.id} className="p-4 hover:bg-amber-50/50 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                    risk.type === 'Risk' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {risk.type}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{risk.daysInactive}d inactive</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-primary-700 transition-colors truncate">
                                {risk.title}
                            </h4>
                            <p className="text-xs text-slate-500">
                                Value: ${risk.value.toLocaleString()} • Prob: {risk.probability}%
                            </p>
                            <div className="mt-3 flex items-center text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-200">
                                View Deal <ArrowUpRight className="ml-1 w-3 h-3" />
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                            All deals are healthy!
                        </div>
                    )}
                 </div>
            </Card>

            {/* Tasks Preview (Limited) */}
            <Card noPadding>
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                     <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" /> Priorities
                    </h2>
                    <button className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors">See all</button>
                </div>
                <div className="divide-y divide-slate-50">
                    {MOCK_TASKS.slice(0, 4).map(task => (
                        <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 group">
                             <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                 task.priority === 'High' ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                             }`}></div>
                             <div className="min-w-0">
                                <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                    {task.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                   <Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                             </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Smart Insights (Advisory) */}
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                 <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Insights
                 </h3>
                 <ul className="space-y-3">
                     <li className="text-xs text-indigo-800 leading-relaxed">
                         <strong className="block font-bold mb-0.5">Bottleneck detected</strong>
                         Deals are spending <span className="font-bold">20% longer</span> in "Qualify" stage than last month.
                     </li>
                     <li className="text-xs text-indigo-800 leading-relaxed pt-2 border-t border-indigo-200/50">
                         <strong className="block font-bold mb-0.5">Win Rate</strong>
                         Your win rate is highest with clients in the <span className="font-bold">Tech</span> sector (65%).
                     </li>
                 </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;