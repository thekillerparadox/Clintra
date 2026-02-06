import React, { useState } from 'react';
import { MOCK_DEALS, MOCK_CLIENTS } from '../constants';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useToast } from '../components/Toast';
import { Search, Download, Filter, Pencil, Trash2, AlertTriangle, CheckCircle2, PauseCircle } from 'lucide-react';

const DealsList: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const getClient = (id: string) => MOCK_CLIENTS.find(c => c.id === id);

  const filteredDeals = MOCK_DEALS.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getClient(d.clientId)?.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Client', 'Value', 'Stage', 'Health', 'Probability', 'Close Date', 'Priority'];
    const csvContent = [
      headers.join(','),
      ...filteredDeals.map(deal => {
        const client = getClient(deal.clientId);
        const health = getDealHealth(deal);
        return [
          deal.id,
          `"${deal.title.replace(/"/g, '""')}"`,
          `"${client?.company.replace(/"/g, '""') || ''}"`,
          deal.value,
          deal.stage,
          health.status,
          deal.probability + '%',
          deal.expectedCloseDate,
          deal.priority
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `deals_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Mock Owners for visual completeness since MOCK_DEALS doesn't have owner IDs
  const MOCK_OWNERS = [
      { name: 'Henry, Arthur', avatar: 'https://ui-avatars.com/api/?name=Arthur+Henry&background=c4b5fd&color=fff' },
      { name: 'Miles, Esther', avatar: 'https://ui-avatars.com/api/?name=Esther+Miles&background=fed7aa&color=fff' },
      { name: 'Nguyen, Shane', avatar: 'https://ui-avatars.com/api/?name=Shane+Nguyen&background=cbd5e1&color=fff' },
      { name: 'Black, Marvin', avatar: 'https://ui-avatars.com/api/?name=Marvin+Black&background=334155&color=fff' },
      { name: 'Flores, Juanita', avatar: 'https://ui-avatars.com/api/?name=Juanita+Flores&background=ef4444&color=fff' },
      { name: 'Török, Melinda', avatar: 'https://ui-avatars.com/api/?name=Melinda+Torok&background=f9a8d4&color=fff' },
  ];

  const getOwner = (index: number) => MOCK_OWNERS[index % MOCK_OWNERS.length];

  const getDealHealth = (deal: any) => {
      // Mock logic for visual variety matching the design
      if (deal.value > 10000 && deal.probability < 50) return { status: 'At Risk', icon: PauseCircle, color: 'text-rose-600' };
      if (deal.stage === 'Quote' || deal.priority === 'High') return { status: 'Stalled', icon: AlertTriangle, color: 'text-orange-500' };
      return { status: 'Healthy', icon: CheckCircle2, color: 'text-emerald-500' };
  };

  const getStageColor = (stage: string) => {
      switch(stage) {
          case 'Negotiate': return 'bg-fuchsia-100 text-fuchsia-700';
          case 'Proposal': return 'bg-blue-100 text-blue-700';
          case 'Closing': return 'bg-emerald-100 text-emerald-700';
          case 'Quote': return 'bg-slate-100 text-slate-700';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deals</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track and manage your opportunities list.
          </p>
        </div>
        <Button icon={Download} variant="outline" onClick={handleExport}>Export data</Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
         <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input 
                 type="text" 
                 placeholder="Search deals..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800 border-transparent text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-slate-800 transition-all shadow-sm"
             />
         </div>
         <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm">
             <Filter className="h-4 w-4" /> Filters
         </button>
      </div>

      {/* Table */}
      <Card noPadding className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-slate-100/50 border-b border-slate-200">
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs w-full">Row name</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs whitespace-nowrap">Value</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs text-center whitespace-nowrap">Stage</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs whitespace-nowrap">Health</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs whitespace-nowrap">Close date</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs whitespace-nowrap">Owner</th>
                        <th className="px-6 py-4 font-bold text-slate-500 text-xs text-left whitespace-nowrap w-[1%]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredDeals.map((deal, index) => {
                        const client = getClient(deal.clientId);
                        const health = getDealHealth(deal);
                        const owner = getOwner(index);
                        const HealthIcon = health.icon;

                        return (
                            <tr 
                                key={deal.id} 
                                onClick={() => navigate(`/deals/${deal.id}`)}
                                className="group hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{deal.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{client?.company}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                    ${deal.value.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getStageColor(deal.stage)}`}>
                                        {deal.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <HealthIcon className={`h-4 w-4 ${health.color}`} />
                                        <span className={`text-xs font-medium ${health.status === 'Healthy' ? 'text-slate-600' : health.color}`}>
                                            {health.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <img src={owner.avatar} alt={owner.name} className="h-6 w-6 rounded-full" />
                                        <span className="text-slate-700 text-xs font-medium">{owner.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-left whitespace-nowrap">
                                    <div className="flex items-center justify-start gap-1" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToast(`Editing ${deal.title}`, 'info');
                                            }}
                                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToast(`Deleted ${deal.title}`, 'error');
                                            }}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default DealsList;