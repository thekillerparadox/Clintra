import React, { useState } from 'react';
import { MOCK_TASKS, MOCK_DEALS } from '../constants';
import Card from '../components/Card';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, Briefcase, CheckSquare } from 'lucide-react';
import Button from '../components/Button';

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  const days = Array.from({ length: 35 }, (_, i) => {
      const dayNum = i - startDay + 1;
      return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const getEventsForDay = (day: number) => {
      if (!day) return [];
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
      
      const dayTasks = MOCK_TASKS.filter(t => t.dueDate.startsWith(dateStr));
      const dayDeals = MOCK_DEALS.filter(d => d.expectedCloseDate.startsWith(dateStr));
      
      return [...dayTasks.map(t => ({ ...t, type: 'task' })), ...dayDeals.map(d => ({ ...d, type: 'deal' }))];
  };

  // Upcoming Agenda Logic
  const upcomingEvents = [...MOCK_TASKS.map(t => ({ ...t, type: 'task', date: t.dueDate })), ...MOCK_DEALS.map(d => ({ ...d, type: 'deal', date: d.expectedCloseDate }))]
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-enter">
      {/* Main Calendar Grid */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentMonth} {currentYear}</h1>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-50 rounded"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-slate-50 rounded"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                 <Button variant="secondary" size="sm" onClick={() => setCurrentDate(today)}>Today</Button>
                 <Button size="sm" icon={Plus}>Event</Button>
            </div>
        </div>

        <Card noPadding className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm min-h-[400px]">
              {/* Weekday Header */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {day}
                      </div>
                  ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                  {days.map((day, idx) => {
                      const events = getEventsForDay(day || 0);
                      const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth();

                      return (
                          <div key={idx} className={`min-h-[80px] sm:min-h-[100px] border-b border-r border-slate-100 p-1 sm:p-2 transition-colors hover:bg-slate-50 ${!day ? 'bg-slate-50/30' : ''}`}>
                              {day && (
                                  <>
                                      <div className={`text-xs font-medium mb-1 sm:mb-2 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-slate-500'}`}>
                                          {day}
                                      </div>
                                      <div className="space-y-1">
                                          {events.map((evt: any) => (
                                              <div 
                                                key={evt.id || evt.title} 
                                                className={`text-[10px] px-1.5 py-1 rounded truncate border ${
                                                    evt.type === 'deal' 
                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700 font-bold' 
                                                    : 'bg-white border-slate-200 text-slate-600'
                                                }`}
                                                title={evt.title}
                                              >
                                                  <span className="hidden sm:inline">{evt.type === 'deal' ? '💰 ' : '☐ '}</span>
                                                  {evt.title}
                                              </div>
                                          ))}
                                          {events.length === 0 && (
                                              <div className="h-full" />
                                          )}
                                      </div>
                                  </>
                              )}
                          </div>
                      );
                  })}
              </div>
        </Card>
      </div>

      {/* Side Panel: Agenda */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" /> Upcoming
              </h3>
              <div className="space-y-4">
                  {upcomingEvents.map((evt: any, idx) => (
                      <div key={idx} className="flex gap-3 group">
                          <div className="flex flex-col items-center pt-1 min-w-[3rem]">
                              <span className="text-xs font-bold text-slate-500 uppercase">{new Date(evt.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                              <span className="text-xl font-bold text-slate-900">{new Date(evt.date).getDate()}</span>
                          </div>
                          <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 group-last:pb-0">
                              <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors cursor-pointer">{evt.title}</p>
                              <div className="flex items-center gap-2">
                                  {evt.type === 'deal' ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                                          <Briefcase className="h-3 w-3" /> Deal Close
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                          <CheckSquare className="h-3 w-3" /> Task
                                      </span>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                      <p className="text-sm text-slate-500">No upcoming events.</p>
                  )}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default Calendar;