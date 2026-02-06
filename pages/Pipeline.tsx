import React, { useState, useEffect } from 'react';
import { MOCK_DEALS, MOCK_CLIENTS } from '../constants';
import { DealStage, Deal } from '../types';
import Button from '../components/Button';
import DealDetailPanel from '../components/DealDetailPanel';
import { 
  Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Phone, 
  Wallet, TrendingUp, AlertTriangle, Activity, X
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const STAGES = Object.values(DealStage);

const Pipeline: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get('filter');

  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const getClient = (id: string) => MOCK_CLIENTS.find(c => c.id === id);
  const getDaysInactive = (dateStr: string) => Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));

  // Risk Logic: Priority is High OR Inactive > 7 days
  const isRisk = (deal: Deal) => deal.priority === 'High' || getDaysInactive(deal.lastActivityDate) > 7;

  const filteredDeals = deals.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          getClient(d.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'risk') {
        return matchesSearch && isRisk(d);
    }
    return matchesSearch;
  });

  const clearFilter = () => {
      setSearchParams({});
  };

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      
      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                 <Filter className="h-4 w-4" /> Filter
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                 <ArrowUpDown className="h-4 w-4" /> Sort
             </button>
          </div>
      </div>

      {/* Risk Filter Active Banner */}
      {filterType === 'risk' && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between animate-enter">
              <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-orange-900">Risk Filter Active: Showing {filteredDeals.length} deals requiring attention.</span>
              </div>
              <button onClick={clearFilter} className="text-sm font-medium text-orange-700 hover:underline flex items-center gap-1">
                  Clear Filter <X className="h-3 w-3" />
              </button>
          </div>
      )}

      {/* Metrics Row (Hide if filtered to focus on risk) */}
      {filterType !== 'risk' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
            <MetricCard label="Total Value" value="$1.2M" trend="+12% vs last month" icon={Wallet} color="bg-primary-50 text-primary-600" />
            <MetricCard label="Weighted Value" value="$450k" trend="-5% vs last month" icon={Activity} color="bg-blue-50 text-blue-600" />
            <MetricCard label="Deals at Risk" value="3" trend="+1 new risk" icon={AlertTriangle} color="bg-orange-50 text-orange-600" />
            <MetricCard label="Avg Velocity" value="14 Days" trend="Same as last week" icon={TrendingUp} color="bg-slate-100 text-slate-600" />
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-6 lg:px-6">
         <div className="flex h-full gap-6 min-w-max">
            {STAGES.map((stage) => {
                 const stageDeals = filteredDeals.filter(d => d.stage === stage);
                 const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

                 return (
                     <div key={stage} className={`w-[320px] flex flex-col h-full rounded-xl p-2 border transition-colors ${filterType === 'risk' && stageDeals.length > 0 ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-100/50 border-slate-200/50'}`}>
                         {/* Column Header */}
                         <div className="flex items-center justify-between mb-3 px-2 pt-2 pb-1">
                             <div className="flex items-center gap-2">
                                 <h3 className={`font-bold text-sm uppercase tracking-wider ${filterType === 'risk' ? 'text-orange-900' : 'text-slate-900'}`}>{stage}</h3>
                                 <span className="bg-white text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">{stageDeals.length}</span>
                             </div>
                             <span className="text-xs font-bold text-slate-400">${stageValue.toLocaleString()}</span>
                         </div>

                         {/* Cards */}
                         <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
                             {stageDeals.map(deal => {
                                 const client = getClient(deal.clientId);
                                 const daysInactive = getDaysInactive(deal.lastActivityDate);
                                 const isStalled = daysInactive > 7;

                                 return (
                                     <div 
                                        key={deal.id} 
                                        onClick={() => setSelectedDealId(deal.id)}
                                        className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 duration-200 ${
                                            filterType === 'risk' ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'
                                        }`}
                                     >
                                         <div className="flex justify-between items-start mb-2">
                                             <h4 className="font-bold text-slate-900 text-sm">{deal.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</h4>
                                             {isStalled && (
                                                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Stalled</span>
                                             )}
                                         </div>
                                         <h3 className="text-sm font-bold text-slate-800 mb-1">{client?.company}</h3>
                                         <p className="text-xs text-slate-500 mb-3 line-clamp-2">{deal.title}</p>
                                         
                                         <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                             <div className="flex items-center gap-2">
                                                 <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                     {client?.name.charAt(0)}
                                                 </div>
                                                 <span className="text-xs text-slate-400">{client?.name}</span>
                                             </div>
                                             <span className={`text-[10px] ${isStalled ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>{daysInactive}d ago</span>
                                         </div>
                                     </div>
                                 );
                             })}
                             {filterType !== 'risk' && (
                                <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm hover:bg-white hover:border-slate-400 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Deal
                                </button>
                             )}
                         </div>
                     </div>
                 );
            })}
         </div>
      </div>

      {/* Side Panel Overlay */}
      {selectedDeal && (
          <DealDetailPanel 
            deal={selectedDeal} 
            onClose={() => setSelectedDealId(null)} 
            onActionComplete={() => {
                // Optional: refresh data or loop
                console.log("Loop complete");
            }}
          />
      )}

    </div>
  );
};

const MetricCard = ({ label, value, trend, icon: Icon, color }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
        </div>
        <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {trend}
        </div>
    </div>
);

export default Pipeline;