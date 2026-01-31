import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import ClientProfile from './pages/ClientProfile';
import ClientsList from './pages/ClientsList';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Login from './pages/Login';
import QuickCapture from './components/QuickCapture';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './components/Toast';
import { Plus, Menu, Bell, Search as SearchIcon } from 'lucide-react';

// Shell Layout for Authenticated Users
const AuthenticatedLayout: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        
        {/* Mobile / Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                    <Menu className="h-5 w-5" />
                </button>
                {/* Breadcrumbs or Page Title could go here */}
            </div>

            <div className="flex items-center gap-4">
                <div 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors w-64"
                >
                    <SearchIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Search...</span>
                    <span className="ml-auto text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">⌘K</span>
                </div>
                
                <button 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                    <SearchIcon className="h-5 w-5" />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full hover:text-primary-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto min-h-full">
                {children}
            </div>
        </div>
        
        {/* Floating Action Button */}
        <button 
            onClick={() => setIsQuickCaptureOpen(true)}
            className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 h-14 w-14 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40 group"
            title="Quick Capture"
        >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Global Overlays */}
        <QuickCapture isOpen={isQuickCaptureOpen} onClose={() => setIsQuickCaptureOpen(false)} />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple persisted auth simulation
  useEffect(() => {
    const authState = localStorage.getItem('clientra_auth');
    if (authState === 'true') {
        setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
      setIsAuthenticated(true);
      localStorage.setItem('clientra_auth', 'true');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('clientra_auth');
  };

  return (
    <ToastProvider>
        <HashRouter>
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } />
            
            <Route path="/*" element={
                isAuthenticated ? (
                    <AuthenticatedLayout onLogout={handleLogout}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/pipeline" element={<Pipeline />} />
                            <Route path="/clients" element={<ClientsList />} />
                            <Route path="/clients/:id" element={<ClientProfile />} />
                            <Route path="/tasks" element={<Tasks />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthenticatedLayout>
                ) : (
                    <Navigate to="/login" replace />
                )
            } />
        </Routes>
        </HashRouter>
    </ToastProvider>
  );
};

export default App;