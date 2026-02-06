import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Kanban, Briefcase, Users, CheckSquare, Calendar, 
  Activity, Zap, BarChart, FileText, HelpCircle, Command, LogOut 
} from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

interface NavItemProps {
    item: {
        label: string;
        path: string;
        icon: React.ElementType;
        badge?: number;
    };
    onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClose }) => (
  <NavLink
    to={item.path}
    onClick={() => { if(window.innerWidth < 1024) onClose() }}
    className={({ isActive }) =>
      `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center">
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
              isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          {item.label}
        </div>
        {item.badge && (
           <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
             {item.badge}
           </span>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  
  const platformItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Pipeline', path: '/pipeline', icon: Kanban },
    { label: 'Deals', path: '/deals', icon: Briefcase },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare, badge: 4 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Activities', path: '/activities', icon: Activity },
  ];

  const intelligenceItems = [
    { label: 'Automations', path: '/automations', icon: Zap },
    { label: 'Reports', path: '/reports', icon: BarChart },
    { label: 'Documents', path: '/documents', icon: FileText },
  ];

  return (
    <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                onClick={onClose}
            ></div>
        )}

        {/* Sidebar Container */}
        <aside className={`
            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col h-full transition-transform duration-300 ease-spring
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-transparent">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <span className="text-slate-900 font-bold text-lg tracking-tight">Clientra</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-stable">
            
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Platform</h3>
              <nav>
                {platformItems.map((item) => <NavItem key={item.label} item={item} onClose={onClose} />)}
              </nav>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Intelligence</h3>
              <nav>
                {intelligenceItems.map((item) => <NavItem key={item.label} item={item} onClose={onClose} />)}
              </nav>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
             <div className="space-y-1">
                 <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors">
                     <HelpCircle className="mr-3 h-5 w-5 text-slate-400" />
                     Help Center
                 </button>
                 <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors">
                     <Command className="mr-3 h-5 w-5 text-slate-400" />
                     Shortcuts
                 </button>
                 <button 
                    onClick={onLogout}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors mt-4"
                >
                     <LogOut className="mr-3 h-5 w-5" />
                     Logout
                 </button>
             </div>
          </div>
        </aside>
    </>
  );
};

export default Sidebar;