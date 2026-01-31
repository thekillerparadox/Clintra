import React, { useState } from 'react';
import { MOCK_CLIENTS, MOCK_DEALS } from '../constants';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { Search, Plus, Phone, Mail, ChevronRight, Filter, MoreHorizontal, Calendar } from 'lucide-react';

const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOpenDealsCount = (clientId: string) => MOCK_DEALS.filter(d => d.clientId === clientId && d.stage !== 'Won' && d.stage !== 'Lost').length;
  const getLastContactDays = (dateStr: string) => Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clients</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage relationships and track interaction health.
          </p>
        </div>
        <Button icon={Plus}>Add Client</Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="relative flex-1 group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
             <input 
                 type="text" 
                 placeholder="Search clients or companies..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 text-sm border-none focus:ring-0 text-slate-900 placeholder:text-slate-400"
             />
         </div>
         <div className="h-6 w-px bg-slate-200"></div>
         <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
             <Filter className="h-4 w-4" /> Filters
         </button>
      </div>

      {/* Client Grid/List */}
      <Card noPadding>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Client / Company</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Engagement</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Next Action</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-500 uppercase text-xs tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredClients.map((client) => {
                        const daysAgo = getLastContactDays(client.lastContact);
                        const dealsCount = getOpenDealsCount(client.id);

                        return (
                            <tr 
                                key={client.id} 
                                onClick={() => navigate(`/clients/${client.id}`)}
                                className="group hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={client.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white border border-slate-100" />
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{client.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{client.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={client.status === 'Active' ? 'success' : 'neutral'}>
                                        {client.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                                            {dealsCount > 0 ? (
                                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-bold">{dealsCount} DEAL{dealsCount !== 1 && 'S'}</span>
                                            ) : (
                                                <span className="text-slate-400 text-[10px]">NO DEALS</span>
                                            )}
                                        </span>
                                        <span className={`text-xs ${daysAgo > 14 ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                                            Last contact {daysAgo}d ago
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {client.nextAction ? (
                                        <div className="flex items-start gap-2 max-w-[200px]">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-slate-700 truncate">{client.nextAction}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(client.nextActionDate || '').toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">None scheduled</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all"><Phone className="h-4 w-4" /></button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all"><Mail className="h-4 w-4" /></button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        {filteredClients.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                <p>No clients found matching "{searchTerm}"</p>
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="mt-2">Clear Search</Button>
            </div>
        )}
      </Card>
    </div>
  );
};

export default ClientsList;