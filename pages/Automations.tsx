import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Zap, Plus, ArrowRight, CheckCircle2, Mail, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

const Automations: React.FC = () => {
  const [activeWorkflows, setActiveWorkflows] = useState<string[]>(['1']);

  const toggleWorkflow = (id: string) => {
      if (activeWorkflows.includes(id)) {
          setActiveWorkflows(activeWorkflows.filter(w => w !== id));
      } else {
          setActiveWorkflows([...activeWorkflows, id]);
      }
  };

  return (
    <div className="space-y-6 animate-enter">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automations</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Streamline your workflow with "If This, Then That" logic.</p>
            </div>
            <Button icon={Plus}>New Workflow</Button>
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pt-2">Active Workflows</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkflowCard 
                id="1"
                title="New Lead Welcome"
                lastRun="2 hours ago"
                trigger={{ icon: Zap, text: "New Contact" }}
                action={{ icon: Mail, text: "Send Welcome Email" }}
                isActive={activeWorkflows.includes('1')}
                onToggle={() => toggleWorkflow('1')}
                color="emerald"
            />
            <WorkflowCard 
                id="2"
                title="Stalled Deal Alert"
                lastRun="Paused"
                trigger={{ icon: AlertCircle, text: "Deal Inactive (7d)" }}
                action={{ icon: CheckCircle2, text: "Create Task" }}
                isActive={activeWorkflows.includes('2')}
                onToggle={() => toggleWorkflow('2')}
                color="orange"
            />
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pt-6">Recommended Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <TemplateCard 
                title="Meeting Follow-up"
                description="Automatically send a summary email after a calendar event ends."
                icon={Calendar}
             />
             <TemplateCard 
                title="Slack Notification"
                description="Post to #sales channel when a deal status changes to 'Won'."
                icon={MessageSquare}
             />
             <TemplateCard 
                title="Re-engagement"
                description="Email contacts who haven't been active in 30 days."
                icon={Mail}
             />
        </div>
    </div>
  );
};

const WorkflowCard = ({ id, title, lastRun, trigger, action, isActive, onToggle, color }: any) => {
    const activeColor = isActive ? (color === 'emerald' ? 'border-l-emerald-500' : 'border-l-orange-500') : 'border-l-slate-300';
    
    return (
        <Card className={`p-6 border-l-4 transition-all ${activeColor} ${!isActive && 'opacity-75 grayscale'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? `bg-${color}-50 text-${color}-600` : 'bg-slate-100 text-slate-500'}`}>
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{title}</h3>
                        <p className="text-xs text-slate-500">Last run: {lastRun}</p>
                    </div>
                </div>
                <button 
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-primary-600' : 'bg-slate-200'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium flex items-center gap-1"><trigger.icon className="h-3.5 w-3.5" /> {trigger.text}</span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
                <span className="font-medium flex items-center gap-1"><action.icon className="h-3.5 w-3.5" /> {action.text}</span>
            </div>
        </Card>
    );
};

const TemplateCard = ({ title, description, icon: Icon }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 border-dashed hover:border-solid hover:border-primary-300 hover:shadow-md cursor-pointer transition-all group">
        <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 mb-3 transition-colors">
            <Icon className="h-5 w-5" />
        </div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">{description}</p>
        <span className="text-xs font-bold text-primary-600 group-hover:underline">Use Template →</span>
    </div>
);

export default Automations;