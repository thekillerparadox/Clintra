import React, { useState, useMemo } from 'react';
import { MOCK_TASKS } from '../constants';
import { Task } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CheckSquare, Calendar, Filter, Plus, Clock, AlertCircle, ChevronDown } from 'lucide-react';

const TaskGroup: React.FC<{ 
    title: string; 
    tasks: Task[]; 
    icon: React.ElementType; 
    iconColor: string; 
    onToggle: (id: string) => void 
}> = ({ title, tasks, icon: Icon, iconColor, onToggle }) => {
    if (tasks.length === 0) return null;

    return (
        <div className="mb-8 animate-enter">
            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
                <Icon className={`h-4 w-4 ${iconColor}`} /> {title} <span className="text-slate-300 ml-1">({tasks.length})</span>
            </h3>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`group bg-white border border-slate-200 rounded-lg p-4 transition-all hover:shadow-sm hover:border-primary-300 flex items-start gap-3 ${task.completed ? 'opacity-60 bg-slate-50' : ''}`}
                    >
                        <div className="pt-0.5">
                            <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => onToggle(task.id)}
                                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors" 
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm font-semibold truncate transition-colors ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-primary-700'}`}>
                                    {task.title}
                                </p>
                                <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'neutral'} className="ml-2 shrink-0">
                                    {task.priority}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`text-xs flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                {task.relatedDealId && (
                                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                                        Deal Related
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const { overdue, today, upcoming, completed } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const overdue: Task[] = [];
    const todayTasks: Task[] = [];
    const upcoming: Task[] = [];
    const completed: Task[] = [];

    tasks.forEach(t => {
        if (t.completed) {
            completed.push(t);
            return;
        }
        
        const due = new Date(t.dueDate);
        due.setHours(0,0,0,0);

        if (due < now) overdue.push(t);
        else if (due.getTime() === now.getTime()) todayTasks.push(t);
        else upcoming.push(t);
    });

    return { overdue, today: todayTasks, upcoming, completed };
  }, [tasks]);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-enter">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Focus</h1>
           <p className="text-sm font-medium text-slate-500 mt-1">
             Prioritize your attention. You have <span className="text-slate-900 font-bold">{overdue.length + today.length} tasks</span> requiring action.
           </p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" icon={Filter} size="sm">Filter</Button>
            <Button variant="primary" icon={Plus} size="sm">Add Task</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Overdue Section */}
        {overdue.length > 0 && (
            <div className="bg-rose-50/50 rounded-xl border border-rose-100 p-6 mb-2">
                <TaskGroup 
                    title="Overdue" 
                    tasks={overdue} 
                    icon={AlertCircle} 
                    iconColor="text-rose-500" 
                    onToggle={toggleTask} 
                />
            </div>
        )}

        {/* Main Feed */}
        <div className="p-2">
            <TaskGroup 
                title="Due Today" 
                tasks={today} 
                icon={Clock} 
                iconColor="text-primary-500" 
                onToggle={toggleTask} 
            />
            
            {today.length === 0 && overdue.length === 0 && (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                        <CheckSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-slate-900 font-medium">All caught up!</h3>
                    <p className="text-slate-500 text-sm">No tasks due today. Enjoy your focus time.</p>
                </div>
            )}

            <TaskGroup 
                title="Upcoming" 
                tasks={upcoming} 
                icon={Calendar} 
                iconColor="text-slate-400" 
                onToggle={toggleTask} 
            />
        </div>

        {/* Completed Toggle (Simple implementation) */}
        {completed.length > 0 && (
             <div className="mt-8 border-t border-slate-200 pt-6 opacity-60 hover:opacity-100 transition-opacity">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Completed ({completed.length})</h3>
                 <div className="space-y-2">
                     {completed.map(t => (
                         <div key={t.id} className="flex items-center gap-3 p-2 group">
                             <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-slate-300 text-slate-400" />
                             <span className="text-sm text-slate-400 line-through group-hover:text-slate-500 transition-colors">{t.title}</span>
                         </div>
                     ))}
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;