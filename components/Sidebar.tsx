import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, CheckSquare, LogOut, Settings } from 'lucide-react';
import { NavItem } from '../types';
import Logo from './Logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Pipeline', path: '/pipeline', icon: Kanban },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
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
            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-400 transition-transform duration-300 ease-spring
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 mb-2 mt-2">
            <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight group cursor-default">
              <div className="h-8 w-8 bg-primary-600 rounded-lg shadow-lg shadow-primary-900/50 flex items-center justify-center overflow-hidden">
                 <Logo size={20} color1="text-white" color2="text-primary-200" animated />
              </div>
              <span>Clientra</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Menu</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { if(window.innerWidth < 1024) onClose() }}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

             <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">System</h3>
              <nav className="space-y-1">
                 <NavLink
                    to="/settings"
                    onClick={() => { if(window.innerWidth < 1024) onClose() }}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`
                    }
                  >
                     <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
                     Settings
                  </NavLink>
              </nav>
            </div>
          </div>

          {/* User Footer */}
          <div className="p-4 border-t border-slate-800">
            <NavLink to="/settings" className="flex items-center p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer mb-2">
                <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium text-xs border-2 border-slate-600">
                    JD
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-slate-500">Freelancer Pro</p>
                </div>
            </NavLink>
            <button 
                onClick={onLogout}
                className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>
    </>
  );
};

export default Sidebar;