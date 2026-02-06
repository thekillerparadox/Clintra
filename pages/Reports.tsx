import React from 'react';
import Card from '../components/Card';
import { BarChart, TrendingUp, DollarSign, Users, PieChart as PieChartIcon, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBar, Bar, XAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, YAxis } from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4200 },
  { name: 'Sep', value: 5100 },
];

const SOURCE_DATA = [
    { name: 'Referral', value: 45, color: '#8b5cf6' },
    { name: 'Cold Outreach', value: 25, color: '#3b82f6' },
    { name: 'Inbound', value: 20, color: '#10b981' },
    { name: 'Events', value: 10, color: '#f59e0b' },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6 animate-enter">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Performance analytics and revenue forecasting.</p>
          </div>
          <div className="flex gap-2">
              <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>Year to Date</option>
              </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-lg"><DollarSign className="h-6 w-6"/></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Revenue (YTD)</p>
                        <p className="text-2xl font-bold text-slate-900">$124,500</p>
                    </div>
                </div>
                <div className="text-emerald-600 flex items-center gap-1 text-sm font-bold bg-emerald-50 px-2 py-1 rounded">
                    <ArrowUpRight className="h-4 w-4" /> 12%
                </div>
            </Card>
            <Card className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="h-6 w-6"/></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Win Rate</p>
                        <p className="text-2xl font-bold text-slate-900">24.8%</p>
                    </div>
                </div>
                 <div className="text-emerald-600 flex items-center gap-1 text-sm font-bold bg-emerald-50 px-2 py-1 rounded">
                    <ArrowUpRight className="h-4 w-4" /> 4%
                </div>
            </Card>
            <Card className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="h-6 w-6"/></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">New Leads</p>
                        <p className="text-2xl font-bold text-slate-900">142</p>
                    </div>
                </div>
                <div className="text-rose-600 flex items-center gap-1 text-sm font-bold bg-rose-50 px-2 py-1 rounded">
                    <ArrowUpRight className="h-4 w-4 rotate-90" /> 2%
                </div>
            </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-slate-400" /> Revenue Trend
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA}>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-slate-400" /> Lead Sources
                </h3>
                <div className="h-80 w-full flex flex-col md:flex-row items-center justify-center gap-8">
                     <div className="h-full w-full md:w-1/2 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={SOURCE_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
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
                     
                     <div className="w-full md:w-1/2 space-y-3">
                         {SOURCE_DATA.map((entry) => (
                             <div key={entry.name} className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                     <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                                 </div>
                                 <span className="text-sm font-bold text-slate-900">{entry.value}%</span>
                             </div>
                         ))}
                     </div>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default Reports;