import React from 'react';
import { MOCK_ACTIVITIES, MOCK_CLIENTS } from '../constants';
import Card from '../components/Card';
import { Mail, Phone, Calendar, Search, Filter } from 'lucide-react';

const Activities: React.FC = () => {
  const getClient = (id: string) => MOCK_CLIENTS.find(c => c.id === id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activities</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Global feed of all interactions and updates.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input type="text" placeholder="Search activities..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm" />
         </div>
         
         <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-lg shadow-sm whitespace-nowrap">
                All
            </button>
            <button className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm whitespace-nowrap">
                Emails
            </button>
            <button className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm whitespace-nowrap">
                Calls
            </button>
         </div>
      </div>

      <div className="relative pl-4 sm:pl-8 space-y-8">
          <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-px bg-slate-200"></div>

          {MOCK_ACTIVITIES.map((activity) => {
              const client = getClient(activity.clientId);
              return (
                  <div key={activity.id} className="relative group pl-6 sm:pl-0">
                      <div className={`absolute left-[-13px] sm:left-[-23px] top-1 h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 sm:border-4 border-slate-50 flex items-center justify-center z-10 ${
                          activity.type === 'Email' ? 'bg-blue-100 text-blue-600' : 
                          activity.type === 'Call' ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-orange-100 text-orange-600'
                      }`}>
                          {activity.type === 'Email' ? <Mail className="h-3 w-3 sm:h-4 sm:w-4" /> : activity.type === 'Call' ? <Phone className="h-3 w-3 sm:h-4 sm:w-4" /> : <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </div>
                      
                      <Card className="hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <span className="font-bold text-slate-900">{activity.type}</span>
                                  <span className="text-slate-500 mx-1">with</span>
                                  <span className="font-medium text-primary-600">{client?.name}</span>
                                  <span className="text-slate-400 text-xs ml-2 hidden sm:inline">({client?.company})</span>
                              </div>
                              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-600">{activity.content}</p>
                      </Card>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default Activities;