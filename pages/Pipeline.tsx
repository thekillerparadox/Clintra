import React, { useState } from 'react';
import { MOCK_DEALS, MOCK_CLIENTS, MOCK_TASKS } from '../constants';
import { DealStage, Deal } from '../types';
import Button from '../components/Button';
import { 
  Plus, Search, MoreHorizontal, ArrowRight, CheckSquare, 
  AlertCircle, Brain, X, Loader2, Phone, Mail, Clock, Calendar, Tag
} from 'lucide-react';
import { analyzePipeline } from '../services/geminiService';

const STAGES = Object.values(DealStage);

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const getClient = (id: string) => MOCK_CLIENTS.find(c => c.id === id);
  const getDaysInactive = (dateStr: string) => Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getClient(d.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzePipeline(deals, MOCK_CLIENTS);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const closeAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-8 relative bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
         <div className="flex items-center gap-6">
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pipeline</h1>
             <div className="h-6 w-px bg-slate-200"></div>
             <div className="flex items-center gap-6 text-sm">
                 <div className="hidden md:block">
                    <span className="text-slate-500 font-medium">Total Value: </span>
                    <span className="font-bold text-slate-900">${filteredDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</span>
                 </div>
             </div>
         </div>

         <div className="flex items-center gap-3">
             <Button 
                variant="secondary" 
                icon={Brain} 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="hidden md:flex text-indigo-600 border-indigo-200 hover:bg-indigo-50"
             >
                {isAnalyzing ? 'Thinking...' : 'AI Strategy'}
             </Button>
             <div className="relative w-64 group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                 <input 
                     type="text" 
                     placeholder="Filter deals..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all placeholder:text-slate-400"
                 />
             </div>
             <Button icon={Plus}>Add Deal</Button>
         </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex h-full gap-6 min-w-max">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            
            return (
              <div key={stage} className="w-[340px] flex-shrink-0 flex flex-col h-full group/column">
                
                {/* Stage Header */}
                <div className="flex justify-between items-center mb-4 px-1 pb-2 border-b-2 border-transparent group-hover/column:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-700 text-sm">{stage}</h3>
                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{stageDeals.length}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">${stageValue.toLocaleString()}</span>
                </div>

                {/* Deals List */}
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-12 pr-1">
                  {stageDeals.map(deal => {
                    const client = getClient(deal.clientId);
                    const daysInactive = getDaysInactive(deal.lastActivityDate);
                    const isStalled = daysInactive > 7;

                    return (
                      <div 
                        key={deal.id} 
                        className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lift hover:border-primary-300 transition-all duration-200 ease-spring cursor-pointer relative"
                      >
                         {/* Row 1: Identity */}
                         <div className="flex items-start gap-3 mb-3">
                             <div className="mt-0.5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                 {client?.name.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                 <h4 className="font-bold text-slate-900 text-sm leading-snug truncate" title={deal.title}>{deal.title}</h4>
                                 <p className="text-xs text-slate-500 truncate">{client?.company}</p>
                             </div>
                         </div>

                         {/* Row 2: Metrics */}
                         <div className="flex items-center gap-3 mb-3">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                                ${deal.value.toLocaleString()}
                             </span>
                             <span className={`text-xs font-medium ${deal.probability > 70 ? 'text-success-500' : 'text-slate-400'}`}>
                                {deal.probability}% Prob
                             </span>
                             <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                                {daysInactive}d ago
                             </span>
                         </div>

                         {/* Row 3: Signals & Tags (Muted) */}
                         <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                             <div className="flex gap-1">
                                 <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                     <Tag className="h-2.5 w-2.5" /> Q4
                                 </span>
                             </div>
                             {isStalled && (
                                 <div className="h-2 w-2 rounded-full bg-warning-500 ring-2 ring-warning-50" title="Stalled Deal"></div>
                             )}
                         </div>

                         {/* Hover Actions */}
                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                             <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-primary-600 shadow-sm hover:scale-105 transition-all"><Phone className="h-3.5 w-3.5" /></button>
                             <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-primary-600 shadow-sm hover:scale-105 transition-all"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                         </div>
                      </div>
                    );
                  })}
                  
                  {/* Empty State CTA */}
                  {stageDeals.length === 0 && (
                      <div className="h-24 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer group">
                          <span className="text-xs font-medium flex items-center gap-1 group-hover:text-slate-600"><Plus className="h-3 w-3" /> Add Deal</span>
                      </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Analysis Overlay */}
      {(isAnalyzing || analysisResult) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-enter">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Pipeline Strategy</h3>
                  <p className="text-xs text-slate-500">Powered by Gemini 3.0 Pro Thinking Mode</p>
                </div>
              </div>
              {!isAnalyzing && (
                <button onClick={closeAnalysis} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="p-8 overflow-y-auto">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex relative">
                    <div className="h-3 w-3 bg-indigo-400 rounded-full animate-ping absolute top-0 left-0 opacity-75"></div>
                    <div className="h-3 w-3 bg-indigo-500 rounded-full relative"></div>
                  </div>
                  <p className="text-slate-500 font-medium">Analyzing deals, calculating risks, and formulating strategy...</p>
                </div>
              ) : (
                <div 
                  className="prose prose-sm prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: analysisResult || '' }} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;